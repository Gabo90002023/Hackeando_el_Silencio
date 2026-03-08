type DeepLResponse = {
  translations: {
    text: string;
    detected_source_language: string;
  }[];
};

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";

setGlobalOptions({
    region: "us-central1",
    maxInstances: 10,
})

const setCorsHeaders = (res: any) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
};

export const translate = onRequest(
    async (req, res) => {
        setCorsHeaders(res);
        if (req.method === "OPTIONS") {
            res.status(204).send("");
            return;
        }

        try {
            const { text } = req.body;
            const response = await fetch("https://api-free.deepl.com/v2/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "DeepL-Auth-Key 056e80cc-71e8-4003-82d7-b15c4b48f8d9:fx"
                },
                body: JSON.stringify({
                    text: [text],
                    target_lang: "EN"
                })
            });

            const data = await response.json() as DeepLResponse;
            res.json(data.translations[0].text);
        } catch (error: any) {
            res.status(500).json({
                error: `Error de la api externa: ${error.message}`
            });
        }
    }
);
