const TRANSLATE_URL = 'https://translate-qxdm7zkuqq-uc.a.run.app';

export const translate = async (input: string): Promise<string> => {
    const response = await fetch(TRANSLATE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
    });

    if (!response.ok) {
        throw new Error(`Firebase translate error: ${response.status} ${response.statusText}`);
    }

    const translated: string = await response.json();
    return translated;
};
