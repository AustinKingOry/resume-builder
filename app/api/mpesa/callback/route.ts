/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateMpesaCallback } from "@/lib/payments/mpesa";
import { createServerClient } from "@/lib/supabase-server";
// import { syncMpesaTransactionStatus } from "@/lib/services/payments";
import { getTransactionStatus } from "@/lib/payments/mpesaStatus";
import { NextRequest, NextResponse } from "next/server";
 
export async function POST(request: NextRequest) {
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr');
    const whitelist = [
        '196.201.214.200',
        '196.201.214.206',
        '196.201.213.114',
        '196.201.214.207',
        '196.201.214.208',
        '196.201.213.44',
        '196.201.212.127',
        '196.201.212.138',
        '196.201.212.129',
        '196.201.212.136',
        '196.201.212.74',
        '196.201.212.69'
    ];
   
    if (!clientIp || !whitelist.includes(clientIp)) {
        return NextResponse.json({ error: 'IP not whitelisted' }, { status: 403 });
    }
    const data = await request.json();

    const supabaseAuth = await createServerClient();
    const {data: {user}, } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Please sign in to analyze your CV" }, { status: 401 })
    }

    const token = (await supabaseAuth.auth.getSession()).data.session?.access_token
    if (!token) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }
    
    if (!data.Body.stkCallback.CallbackMetadata) {
        //for failed transactions
        console.log(data.Body.stkCallback.ResultDesc);
        return NextResponse.json("ok saf");
    }
    
    //lets extract the values from the callback metadata
    
    const body = data.Body.stkCallback.CallbackMetadata
    const amountObj = body.Item.find((obj: any) => obj.Name === "Amount");
    const amount = Number(amountObj.Value);
    const checkoutRequestId = data.Body.stkCallback.CheckoutRequestID;
    const resultCode = data.Body.stkCallback.ResultCode;
    const resultDesc = data.Body.stkCallback.ResultDesc;
    
    //mpesa code
    const codeObj = body.Item.find(
        (obj: any) => obj.Name === "MpesaReceiptNumber"
    );
    const mpesaCode = codeObj.Value;
    
    //phone number - in recent implimentations, it is hashed.
    const phoneNumberObj = body.Item.find(
        (obj: any) => obj.Name === "PhoneNumber"
    );
    const phoneNumber = phoneNumberObj.Value.toString();
    
    //Transaction Date
    const transDateObj = body.Item.find(
        (obj: any) => obj.Name === "TransactionDate"
    );
    const transDate = transDateObj.Value.toString();
    
    try {
        const status = getTransactionStatus(resultCode)
        const updates = {
            amount, 
            mpesaReceiptNumber: mpesaCode, 
            phoneNumber, 
            checkoutRequestId, 
            transactionDate: transDate,
            status: status,
            resultCode: resultCode,
            resultDesc: resultDesc
        }
        console.log(updates)
        const result = await updateMpesaCallback(token, checkoutRequestId, updates)
        // await syncMpesaTransactionStatus(checkoutRequestId, result)
        
        return NextResponse.json("ok", { status: 200 });
    } catch (error: any) {
        console.log(error)
        return NextResponse.json("ok");
    }
}