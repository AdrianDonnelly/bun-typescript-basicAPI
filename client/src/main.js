
const component = ['d-flex','justify-content-center'];

async function displayPosts(){
    const data = await GET()
    let postElement = document.getElementById("Post");
    postElement.innerHTML = '';



    data.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('d-flex','flex-column','justify-content-center','w-25','border','m-2','p-2')
        postDiv.classList.add('post');

        const IDElement = document.createElement('h2');
        component.forEach(cls => IDElement.classList.add(cls));
        IDElement.textContent = post.id;

        const titleElement = document.createElement('h2');
        component.forEach(cls => titleElement.classList.add(cls));
        titleElement.textContent = post.title;

        const contentElement = document.createElement('p');
        component.forEach(cls => contentElement.classList.add(cls));
        contentElement.textContent = post.content;

        const DeleteButton = document.createElement('button');
        DeleteButton.classList.add('btn','btn-primary','m-1')
        DeleteButton.textContent = ('Delete')
        DeleteButton.onclick = () => (DELETE(post.id))

        const updateButton = document.createElement('button');
        updateButton.classList.add('btn','btn-primary','m-1')
        updateButton.textContent = 'Update';
        updateButton.onclick = () => showUpdateForm(postDiv, post.id, post.title, post.content);

        
        postDiv.appendChild(IDElement);
        postDiv.appendChild(titleElement);
        postDiv.appendChild(contentElement);
        postDiv.appendChild(DeleteButton)
        postDiv.appendChild(updateButton)
        postElement.appendChild(postDiv);
    });

}

function showUpdateForm(postDiv, id, currentTitle, currentContent) {
    const form = document.createElement('form');
    form.classList.add('d-flex','justify-content-center', 'flex-column')
    form.onsubmit = async (event) => {
        event.preventDefault();
        const newTitle = form.querySelector('#title').value;
        const newContent = form.querySelector('#content').value;
        if (await PATCH(id, newTitle, newContent)) location.reload();
    };

    const titleInput = document.createElement('input');
    titleInput.classList.add('m-1','text-dark')
    titleInput.id = 'title';
    titleInput.type = 'text';
    titleInput.value = currentTitle;

    const contentInput = document.createElement('input');
    contentInput.classList.add('m-1','text-dark')
    contentInput.id = 'content';
    contentInput.type = 'text';
    contentInput.value = currentContent;

    const submitButton = document.createElement('input');
    submitButton.classList.add('btn', 'btn-primary')
    submitButton.type = 'submit';

    form.appendChild(titleInput);
    form.appendChild(contentInput);
    form.appendChild(submitButton);
    postDiv.appendChild(form);
}

async function submitForm(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    if(await POST(title, content)) location.reload();
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
          
    })
    location.reload();
};

async function PATCH(id,title,content){
    const response = await fetch(`http://localhost:3000/api/posts/${id}`,{
        method: "PATCH",
        body: JSON.stringify({
            title: title,
            content: content,
            completed: false
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
          
    })
    location.reload();
};
