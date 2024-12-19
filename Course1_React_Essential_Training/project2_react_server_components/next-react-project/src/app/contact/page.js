// define the action will be performed upon submitting the form
// When you use a Server Action as the action prop of a form, Next.js automatically handles the Promise resolution for you. You don't need to use await explicitly in your component.
// this is a server action, that has to be performed by the server when called from the client side
async function submitForm(formData){
    "use server"; // means this is a server-side component that can be called from the client-side code
    const formFields={
        email: formData.get("email"),
        message:formData.get("message")
    };
    console.log("formFields ", formFields); // output in server's console, which is the 'terminal', not in the browser console
    console.log("ToDo: send these form field values to a backend"); // output in server's console, which is the 'terminal', not in the browser console
    return formFields;
}

// Although the form is initially rendered on the server, the form submission behavior becomes client-interactive after hydration.
export default function Page(){

    return ( // returns a JSX structure that represents a contact form.
            // I have added Tailwind CSS classes for functionality and styling.
        <main className="max-w-md mx-auto p-6 bg-amber-950 shadow-md">
            <div>
                <h1 className="text-2xl font-bold text-center mb-9">Contact Us!!</h1>
                <form className="space-y-4" action={submitForm}>
                    <div>
                        <label htmlFor="email" className="block text-sm text-white-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            className="focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm text-white-700">Message</label>
                        <textarea
                            id="message"
                            required
                            name="message"
                            rows="4"
                            className="focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        ></textarea>
                    </div>
                    <button type="submit" className="text-white bg-blue-600 rounded-md">
                        Submit Message</button>

                </form>
            </div>
        </main>
    )
}