// import { Metadata } from 'next';
import ResumeBuilder from "@/components/BuilderComponent";
import { ResumeDataDb } from "@/lib/types";

// export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
//   const { id }=await params;
//   let product;
//   if(!isUUID(id)){
//     product = await getProductBySlug(id);
//   } else {
//     product = await getProductById(id);
//   }

//   if (!product) {
//     return {
//       title: 'Product Not Found | Mercreationsworld',
//       description: 'The product you are looking for does not exist.',
//     };
//   }

//   const {
//     name,
//     description,
//     itemSlug: slug,
//     image,
//     category,
//     tags,
//   } = product;

//   const productUrl = `https://www.mercreationsworld.com/product/${slug}`;
//   const productImage = image || 'https://www.mercreationsworld.com/images/about.jpeg';

//   return {
//     title: `${name} | Mercreationsworld`,
//     description: description || `Buy ${name}, a unique and customizable gift in our ${category} category.`,
//     keywords: [name, category, ...tags, 'custom gift Kenya', 'personalized gift Nairobi'].join(', '),
//     openGraph: {
//       title: `${name} | Mercreationsworld`,
//       description: description || `A customizable gift perfect for any occasion.`,
//       url: productUrl,
//       siteName: 'Mercreationsworld',
//       images: [
//         {
//           url: productImage,
//           width: 1200,
//           height: 630,
//           alt: name,
//         },
//       ],
//       locale: 'en_KE',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: `${name} | Mercreationsworld`,
//       description: description || 'Discover this personalized gift now available at Mercreationsworld.',
//       images: [productImage],
//       creator: '@mercreationsworld',
//     },
//     alternates: {
//       canonical: productUrl,
//     },
//   };
// }

const initialResumeData: ResumeDataDb = {
	id: "",
	user_id: "",
	data: {
		selectedTemplate: "milan",
		personalInfo: {
			name: "",
			title: "",
			email: "",
			phone: "",
			location: "",
			website: "",
			photo: "",
			gender: "",
			socialMedia: {},
		},
		summary: "",
		experience: [
			{
			title: "",
			company: "",
			startDate: "",
			endDate: "",
			location: "",
			description: "",
			current: false,
			},
		],
		education: [],
		skills: [],
		skillLevels: {},
		certifications: [],
		referees: [],
	},
	title: "Untitled Resume",
	template_id: "milan",
	downloads: 0,
	status: "draft",
}


export default async function ResumePage() {
	return <ResumeBuilder resume={initialResumeData} />
}
