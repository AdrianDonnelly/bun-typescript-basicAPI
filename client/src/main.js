
async function displayPosts(){
    const data = await GET()
    let postElement = document.getElementById("Post");
    postElement.innerHTML = '';

    data.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        const IDElement = document.createElement('h2');
        IDElement.textContent = post.id;

        const titleElement = document.createElement('h2');
        titleElement.textContent = post.title;

        const contentElement = document.createElement('p');
        contentElement.textContent = post.content;

        const DeleteButton = document.createElement('button');
        DeleteButton.textContent = ('delete')
        DeleteButton.onclick = () => (DELETE(post.id))
        
        postDiv.appendChild(IDElement);
        postDiv.appendChild(titleElement);
        postDiv.appendChild(contentElement);
        postDiv.appendChild(DeleteButton)
        postElement.appendChild(postDiv);
    });

}
async function submitForm(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    await POST(title, content);
}


async function GET() {
    try {
        const response = await fetch('http://localhost:3000/api/posts');
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
async function POST(title,content){
    const response = await fetch('http://localhost:3000/api/posts',{
        method: "POST",
        body: JSON.stringify({
            title: title,
            content: content,
            completed: false
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    });


}
async function DELETE(id){
    const response = await fetch(`http://localhost:3000/api/posts/${id}`,{
        method: "DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    });


}
