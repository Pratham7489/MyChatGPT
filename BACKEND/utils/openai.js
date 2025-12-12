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
                }],
        })
    };

    try {
        const response = await fetch(`${process.env.GROQ_API_URL}`, options); 
        const data = await response.json();
        return data.choices[0].message.content; // reply content

    } catch (error) {
        console.error('Error:', error);
    }
};

export default getOpenAIAPIResponse;