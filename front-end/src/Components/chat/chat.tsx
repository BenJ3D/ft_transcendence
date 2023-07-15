import WebsocketClient from "@/app/websocket/websocket.client";

export default function MyForm() {
  function handleSubmit(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/chat', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
       <input name="myInput" className=' text-neutral-900'/>
      </label>
			<div className='space-x-0.5'>
					<button type="submit">   Send   </button>
			</div>
    </form>
  );
}
