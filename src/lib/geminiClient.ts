export async function getGeminiResponse(
  messages: { role: string; text: string }[]
) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in environment variables.");
  }

  const formatInstruction = `
    You are a helpful AI assistant.

    When the user asks for a chart:
    1. First provide a friendly explanation of what the data shows
    2. Then add the JSON chart using this format:

    \`\`\`json
    {
      "type": "line" | "bar" | "pie",
      "data": [{ "name": "Label", "value": number }],
      "xKey": "name",
      "yKey": "value"
    }
    \`\`\`

    3. After the JSON, add insights about trends or patterns you see in the data

    For regular questions (non-chart), respond normally without JSON.

    Example:
    "Here's the monthly sales data you requested:

    \`\`\`json
    {
      "type": "bar",
      "data": [
        { "name": "Jan", "value": 100 },
        { "name": "Feb", "value": 150 }
      ],
      "xKey": "name",
      "yKey": "value"
    }
    \`\`\`
      

    When asked to show tabular data or a table, automatically format it as JSON with type:'table', headers:[], and rows:[] arrays.

    The chart shows a 50% increase from January to February, indicating strong growth."
    `;


  const prompt =
    `${formatInstruction}\n` +
    messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");

  // const prompt = messages
  //   .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
  //   .join("\n");

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
           
          },
          safetySettings: [],
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
