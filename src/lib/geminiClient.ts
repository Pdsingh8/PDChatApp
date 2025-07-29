export async function getGeminiResponse(messages: { role: string; text: string }[]) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in environment variables.");
  }

  const prompt = messages
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Bot'}: ${msg.text}`)
    .join('\n');

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    if (data.candidates && data.candidates.length > 0) {
      let responseText = data.candidates[0].content.parts[0].text;
      // console.log("Res>", data);

      // Remove "bot:"
      responseText = responseText.replace(/^bot:\s*/i, "");

      return responseText;
    }

    console.error("Gemini API response did not contain candidates:", data);
    return "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "An error occurred while generating the response.";
  }
}
