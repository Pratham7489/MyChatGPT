import 'dotenv/config';

const getOpenAIAPIResponse = async (message) => {
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile", // openai/gpt-oss-20b  , llama-3.3-70b-versatile
            messages: [{ 
                    role: "user", 
                    content: message, 
                }]
        })
    };

    try {
        const response = await fetch(`${process.env.GROQ_API_URL}`, options); 

         if (!response.ok) {
            const text = await response.text();
            throw new Error(`Groq API error ${response.status}: ${text}`);
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0]) {
            throw new Error("Invalid Groq response format");
        }

        return data.choices[0].message.content; // reply content

    } catch (error) {
        console.error("Groq API FAILED", error.message);
        throw error;
    }
};

export default getOpenAIAPIResponse;