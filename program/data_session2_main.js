// const urlParams = new URLSearchParams(window.location.search);
// const cardId = urlParams.get('id');
// document.getElementById('img-file').addEventListener('change',async function(e) {
//     const files = e.target.files;
//     if (files.length === 0) {
//         alert('Please select at least one image.');
//         return;
//     }
//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const reader = new FileReader();
//         const blob = new Blob([file], {type: file.type});
//         fetch("*",{
//             method: "POST",
//             body: blob,
//             headers: {
//                 'Content-Type': 'application/octet-stream',
//             }
//         })
//         .then(response => {response.json()})
//         .then(data => { console.log(data)})
//         .catch(error => console.error(error));
//     }
// });


// const array = ["./pictures/File plus.svg","C:/Users/10677/Pictures/Saved Pictures/1.jpg"]
// const renderImage = (url) => {
//     const ul = document.getElementById("img-list")
//     const li = document.createElement("li")
//     li.classList.add("img-item")
//     li.innerHTML = `<img src="${url}" alt="">`
//     ul.appendChild(li)
// }
// array.forEach(url => {
//     renderImage(url)
// });