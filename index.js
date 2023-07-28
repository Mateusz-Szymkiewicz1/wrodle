let current_row = 0;
let current_block = -1;
let paused = false;

let word = window.words[Math.floor(Math.random()*window.words.length)];
const rows = document.querySelectorAll('.row');

document.addEventListener('keypress', function(e){
  if(!paused){
    var charTyped = String.fromCharCode(e.which);
      if (/[a-z]/i.test(charTyped)) {
        if(current_block != 4){
          current_block++;
        }
        if(!rows[current_row].querySelectorAll('.box')[current_block].innerText){
          rows[current_row].querySelectorAll('.box')[current_block].innerText = charTyped.toLowerCase();
        }
      }
    }
  })

  document.addEventListener('keyup', function(e){
    if(!paused){
    if(e.code == 'Backspace'){
      if(current_block != -1){
        rows[current_row].querySelectorAll('.box')[current_block].innerText  = '';
        current_block--;
      }
    }
    if(e.code == 'Enter'){
      let answer = "";
      for(let i = 0; i<=4;i++){
        answer += rows[current_row].querySelectorAll('.box')[i].innerText;
      }
      if(answer.length == 5){
        if(window.words.includes(answer)){
          for(let i = 0; i<=4;i++){
            let letter = answer[i];
            paused = true;
            setTimeout(function(){
              if(!word.includes(letter)){
                rows[current_row].querySelectorAll('.box')[i].classList.add('not');
                document.querySelector(`.${letter}`).classList.add('not');
              }else if(word[i] == letter){
                rows[current_row].querySelectorAll('.box')[i].classList.add('green');
                document.querySelector(`.${letter}`).classList.add('green');
              }else{
                rows[current_row].querySelectorAll('.box')[i].classList.add('orange');
                document.querySelector(`.${letter}`).classList.add('orange');
              }
            }, i*100)
          }
          setTimeout(function(){
            if(current_row != 6){
              current_row++;
              current_block = -1;
              paused = false;
            }
            if(answer == word){
              end('win');
            }else if(current_row == 6){
              end('lose');
            }
          }, 1000)
        }else{
          notify('Not a valid word!');
        }
      }
    }
  }
})

function notify(message){
  if(!document.querySelector('.notif')){
    let div = document.createElement('div');
    div.className = 'notif';
    div.innerText = message;
    document.body.appendChild(div);
    setTimeout(function(){
      div.style.animation = 'slideOutRight .2s ease';
      setTimeout(function(){
        div.remove();
      },200)
    }, 1200)
  }
}

function end(type){
  paused = true;
  let div = document.createElement('div');
  div.className = 'alert';
  let message = '';
  type == 'win' ? message = 'You won <br/> :)' : message = `You lost <br/> :( <br/><span>The word was: ${word}</span>`;
  div.innerHTML = `${message}<br/><button>Play Again</button>`;
  div.style.animation = 'slideInRight .5s ease';
  document.body.appendChild(div);
  div.querySelector('button').addEventListener('click', function(){
    current_row = 0;
    current_block = -1;
    paused = false;
    word = window.words[Math.floor(Math.random()*window.words.length)];
    document.querySelectorAll('.box').forEach(el => {
      el.innerText = '';
    })
    document.querySelectorAll('.not').forEach(el => {
      el.classList.remove('not');
    })
    document.querySelectorAll('.orange').forEach(el => {
      el.classList.remove('orange');
    })
    document.querySelectorAll('.green').forEach(el => {
      el.classList.remove('green');
    })
    div.remove();
  })
}

document.querySelector('.fa-bars').addEventListener('click', function(){
  if(document.querySelector('.menu').style.display == 'none'){
    document.querySelector('.menu').style.display = 'block';
  }else{
    document.querySelector('.menu').style.display = 'none';
  }
})

setTimeout(function(){
  document.body.style.transition = '.4s';
}, 200)

document.querySelector('.theme').addEventListener('click', function(){
  if(document.querySelector('.fa-sun')){
    document.querySelector('.fa-sun').className = 'fa fa-moon';
    localStorage.setItem('wrodle_theme', 'dark');
    document.body.className = 'dark';
  }else{
    document.querySelector('.fa-moon').className = 'fa fa-sun';
    localStorage.setItem('wrodle_theme', 'light');
    document.body.className = '';
  }
})

if(localStorage.getItem('wrodle_theme') && localStorage.getItem('wrodle_theme') == 'dark'){
  document.querySelector('.fa-sun').className = 'fa fa-moon';
  document.body.className = 'dark';
}