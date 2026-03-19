const createElements = (arr) =>{
    const htmlElements =arr.map((el) =>`<span class="btn">${el}</span>`);
    return htmlElements.join(" ");
}
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


const managespinner = (status) =>{
    if(status === true){
        document.getElementById("spinner").classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden')
    }
    else{
        document.getElementById("spinner").classList.add('hidden');
        document.getElementById('word-container').classList.remove('hidden')
    }
}

const loaddata = () =>{
    fetch('https://openapi.programming-hero.com/api/levels/all')
    .then((res) =>res.json())
    .then((json) => displaylessons(json.data)
    )
}

const removeactive =() =>{
    const lessonbuttons =document.querySelectorAll('.lesson-btn')
    lessonbuttons.forEach((btn) => btn.classList.remove('active'))
    
}


const loadLevelWord =(id) =>{
    managespinner(true)
    const url =`https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
    .then((res) => res.json())
    .then((json) =>{
        removeactive()
        const clickbtn =document.getElementById(`lesson-btn-${id}`);
        clickbtn.classList.add('active')
        displaylevelword(json.data)
    })
  
}

const loadwordDetail = async(id) =>{
    const url =`https://openapi.programming-hero.com/api/word/${id}`
    const res =await fetch(url)
    const detalis = await res.json()
    displaywordDetalis(detalis.data)

}
const displaywordDetalis = (word) =>{
    const detailsbox =document.getElementById('detalis-container');
    detailsbox.innerHTML= `
    <div>
        <h2 class="text-2xl font-bold">${word.word}(<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
      </div>
      <div>
        <h2 class="text-xl font-bold">Meaning</h2>
        <p>${word.meaning}</p>
      </div>
      <div>
        <h2 class="text-xl font-bold">Example</h2>
        <p>${word.sentence}</p>
      </div>
      
      <div>
        <h2 class=" font-bold">Synonym</h2>
        <div>
        ${createElements(word.synonyms)}
      </div>
      </div>`
    document.getElementById('my_modal').showModal()
    
}


const displaylevelword = (words) =>{
    const wordcontainer =document.getElementById('word-container')
    wordcontainer.innerHTML ='';

    if(words.length == 0){
        
        wordcontainer.innerHTML=`
        <div class="text-center col-span-full py-10 space-y-4">
        <div class="flex justify-center">
            <img src="./assets/alert-error.png" alt="">
          </div>
            <p class="text-gray-500 font">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-4xl font font-bold">নেক্সট Lesson এ যান</h2>
        </div>
        `;
        managespinner(false)
        return
    }

    for(let word of words){
        const card =document.createElement('div');
        card.innerHTML=`
        <div class="card bg-base-100  shadow-sm">
  <div class="card-body text-center space-y-3">
    
    <h2 class=" font-bold text-3xl ">${word.word ? word.word: 'শব্দ পাওয়া যায়নি'}</h2>
    <p>${word.meaning ? word.meaning :'অর্থ পাওয়া যায়নি'}</p>
    <p class="font-bold text-xl font">${word.pronunciation ? word.pronunciation:'pronunciation পাওয়া যায়নি'}</p>

    <div class="flex justify-between">
        <div onclick="loadwordDetail(${word.id})" class="bg-slate-200 hover:cursor-pointer hover:bg-blue-300 p-2 rounded-md">
            <i class="fa-solid fa-circle-info text-xl"></i>
        </div>
       <div " onclick="pronounceWord('${word.word}')" class="bg-slate-200 hover:cursor-pointer hover:bg-blue-300 p-2 rounded-md">
        <i class="fa-solid fa-volume-high text-xl "></i>
       </div>
        
    </div>
  </div>
</div>
        `;
 
    
        wordcontainer.append(card);
    }
    managespinner(false)
}


 const displaylessons = (lessons) => {
    const lavelcontainer =document.getElementById('lavel-container');
    lavelcontainer.innerHTML='';
    for(let lesson of lessons){
        const btndiv =document.createElement('div');
        btndiv.innerHTML=`
        
       
        <button id="lesson-btn-${lesson.level_no}"  onclick="loadLevelWord(${lesson.level_no})" class="btn btn-primary btn-outline lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson -${lesson.level_no}</button>
        
      
        `;
       lavelcontainer.append(btndiv) 
    }
 }

loaddata()

document.getElementById('btn-search').addEventListener('click', ()=>{
    removeactive()
    const input =document.getElementById('input-search');
    const searchvalue =input.value.trim().toLowerCase();

    
    fetch('https://openapi.programming-hero.com/api/words/all')
    .then((res) => res.json())
    .then((data) =>{
        const allwords =data.data;
        const filterwords =allwords.filter((word)=>word.word.toLowerCase().includes(searchvalue));
        displaylevelword(filterwords)
        
    });
    
});
