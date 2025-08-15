
/**
 * Returns a function that will give the next waiting message
 * based on how long the user has been waiting.
 */
export function createWaitMessageGenerator() {
    const quickMessages = [
      "🤔 Reading through your CV…",
      "📄 Counting how many times you used 'synergy'…",
      "🔍 Checking if your hobbies section includes 'Netflix binging'…",
      "💡 Analyzing bullet point consistency…",
      "📊 Evaluating job market readiness…",
    ];
  
    const slowMessages = [
      "😅 This is taking longer than expected… maybe your CV has plot twists.",
      "🐢 Processing… but at least it's thorough!",
      "🛠️ The AI is still working. Probably fact-checking your 'team player' claim.",
      "🍵 Perfect time to grab a cup of tea while we finish up.",
      "🎭 Your CV must be a page-turner… AI can't put it down.",
    ];
  
    let index = 0;
    let lastTimestamp = Date.now();
  
    return function getNextMessage() {
      const elapsedSeconds = (Date.now() - lastTimestamp) / 1000;
      lastTimestamp = Date.now();
  
      // If total elapsed time is less than 15 seconds, use quickMessages
      if (elapsedSeconds < 15) {
        return quickMessages[index++ % quickMessages.length];
      }
  
      // If it's been a while, switch to slowMessages
      return slowMessages[(index++ % slowMessages.length)];
    };
  }
  