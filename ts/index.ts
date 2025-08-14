import { WordBank } from "./words.js";
const word_bank = new WordBank()

let current_row = 0;
let current_block = -1;
let paused = false;

let word = word_bank.words[Math.floor(Math.random() * word_bank.words.length)];
const rows = document.querySelectorAll('.row');

document.addEventListener('keypress', function (e) {
  if (paused) return
  const charTyped = String.fromCharCode(e.which);
  if (/[a-z]/i.test(charTyped)) {
    if (current_block != 4) {
      current_block++;
    }
    if (!rows[current_row]!.querySelectorAll('.box')[current_block]!.textContent) {
      rows[current_row]!.querySelectorAll('.box')[current_block]!.textContent = charTyped.toLowerCase();
    }
  }
})

document.addEventListener('keyup', function (e) {
  if (paused) return
  if (e.code === 'Backspace' && current_block !== -1) {
    rows[current_row]!.querySelectorAll('.box')[current_block]!.textContent = '';
    current_block--;
  }
  if (e.code !== 'Enter') return
  let answer = "";
  for (let i = 0; i <= 4; i++) {
    answer += rows[current_row]!.querySelectorAll('.box')[i]!.textContent;
  }
  if (answer.length !== 5) return
  if (word_bank.words.includes(answer)) {
    for (let i = 0; i <= 4; i++) {
      const letter = answer[i];
      paused = true;
      setTimeout(function () {
        if (word && letter && !word.includes(letter)) {
          rows[current_row]!.querySelectorAll('.box')[i]!.classList.add('not');
          document.querySelector(`.${letter}`)!.classList.add('not');
        } else if (word && word[i] == letter) {
          rows[current_row]!.querySelectorAll('.box')[i]!.classList.add('green');
          document.querySelector(`.${letter}`)!.classList.add('green');
        } else {
          rows[current_row]!.querySelectorAll('.box')[i]!.classList.add('orange');
          document.querySelector(`.${letter}`)!.classList.add('orange');
        }
      }, i * 100)
    }
    setTimeout(function () {
      if (current_row !== 6) {
        current_row++;
        current_block = -1;
        paused = false;
      }
      if (answer === word) {
        end('win');
      } else if (current_row == 6) {
        end('lose');
      }
    }, 1000)
  } else {
    notify('Not a valid word!');
  }
})

function notify(message: string) {
  if (document.querySelector('.notif')) return
  const div = document.createElement('div');
  div.className = 'notif';
  div.textContent = message;
  document.body.appendChild(div);
  setTimeout(function () {
    div.style.animation = 'slideOutRight .2s ease';
    setTimeout(function () {
      div.remove();
    }, 200)
  }, 1200)
}

function end(type: "win" | "lose") {
  paused = true;
  const div = document.createElement('div');
  div.className = 'alert';
  let message: string;
  type === 'win' ? message = 'You won <br/> :)' : message = `You lost <br/> :( <br/><span>The word was: ${word}</span>`;
  div.innerHTML = `${message}<br/><button>Play Again</button>`;
  div.style.animation = 'slideInRight .5s ease';
  document.body.appendChild(div);
  div.querySelector('button')!.addEventListener('click', function () {
    current_row = 0;
    current_block = -1;
    paused = false;
    word = word_bank.words[Math.floor(Math.random() * word_bank.words.length)];
    document.querySelectorAll('.box').forEach(el => {
      el.textContent = '';
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

document.querySelector('.fa-bars')!.addEventListener('click', function () {
  if (document.querySelector<HTMLElement>('.menu')!.style.display === 'none') {
    document.querySelector<HTMLElement>('.menu')!.style.display = 'block';
  } else {
    document.querySelector<HTMLElement>('.menu')!.style.display = 'none';
  }
})

setTimeout(function () {
  document.body.style.transition = '.4s';
}, 200)

document.querySelector('.theme')!.addEventListener('click', function () {
  if (document.querySelector('.fa-sun')) {
    document.querySelector('.fa-sun')!.className = 'fa fa-moon';
    localStorage.setItem('wrodle_theme', 'dark');
    document.body.className = 'dark';
  } else {
    document.querySelector('.fa-moon')!.className = 'fa fa-sun';
    localStorage.setItem('wrodle_theme', 'light');
    document.body.className = '';
  }
})

if (localStorage.getItem('wrodle_theme') && localStorage.getItem('wrodle_theme') === 'dark') {
  document.querySelector('.fa-sun')!.className = 'fa fa-moon';
  document.body.className = 'dark';
}