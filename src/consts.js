const this_time = new Date()

export const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
]

export const current_year = this_time.getFullYear()

export function diff(a1, a2) {
    return a1.filter(i=>a2.indexOf(i)<0)
    .concat(a2.filter(i=>a1.indexOf(i)<0))
}

export function declOfNum(number, titles) {  
    let cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
}

export function declOfNumText(number, titles){
    return `${number} ${declOfNum(number, titles)}`
}

export const page_posts_size = 12

export const randint = (min, max) => {
    return Math.round(min+Math.random()*(max-min))
}

export const default_titles_new_post = [
    'Как прошёл ваш день?',
    'Что сегодня произошло?',
    'Напишите про сегодняшний день',
]

export const current_question = default_titles_new_post[randint(0, default_titles_new_post.length-1)]


export const mood_colors = [
    {
      "index": 1,
      "color": "#59B959",
      "text_color": "white",
      "name": "Отличное",
      "emoji": "🤩"
    },
    {
      "index": 2,
      "color": "#7dd17d",
      "text_color": "white",
      "name": "Хорошее",
      "emoji": "😃"
    },
    {
      "index": 3,
      "color": "#dff7df",
      "text_color": "white_with_stroke",
      "name": "Нейтральное",
      "emoji": "😶"
    },
    {
      "index": 4,
      "color": "#9985ff",
      "text_color": "white",
      "name": "Скучаю",
      "emoji": "🥺"
    },
    {
      "index": 5,
      "color": "linear-gradient(75deg, #59B959 20%, #ff3347)",
      "text_color": "white",
      "name": "Сменчивое",
      "emoji": "🥴"
    },
    {
      "index": 6,
      "color": "#F1634B",
      "text_color": "white",
      "name": "Плохое",
      "emoji": "🙁"
    },
    {
      "index": 7,
      "color": "#ff3347",
      "text_color": "white",
      "name": "Ужасное",
      "emoji": "😭"
    }
]

export function getMood(i){
    if(i<=0 || i>12){
        return {
            index:-1,
            color:'none',
            text_color:'black',
            name:'Не установлено',
            emoji:null
        }
    }

    return mood_colors[i-1]
}

export function truncateText(text, n) {
    if (text.length <= n) {
      return text;
    }
  
    const lastIndex = text.lastIndexOf(' ', n);
    if (lastIndex === -1) {
      return text.slice(0, n) + '...';
    }
  
    const truncatedText = text.slice(0, lastIndex) + '...';
    return truncatedText;
  }

export function textInputLength(value) {
  return value.replaceAll('&nbsp;', ' ').replaceAll('<br>', ' ').length
}

export const disable_nearmenu_paths = ['/newpost','/extra_question', '/mood_question', '/post_publication', '/post']

