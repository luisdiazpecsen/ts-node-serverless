import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
    const myImportantVariable = process.env.MY_IMPORTANT_VARIABLE;

    if (!myImportantVariable) {
        // throw new Error('Missing MY_IMPORTANT_VARIABLE'); // Muestra información sensible
        throw 'Missing MY_IMPORTANT_VARIABLE';
    }

    console.log('Hello World in Variables Handler');

    return new Response(JSON.stringify({
        myImportantVariable,
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}