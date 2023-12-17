import { Caption, Footer, Text } from "@vkontakte/vkui"
import { useEffect, useRef, useState } from "react"

import './ClearInput.css'
import { textInputLength } from "../../consts"
import { text_maxlength } from "../../limits"


const placeholder_style = {
    opacity:'50'
}

export const ClearInput = ({defaultValue='', placeholder='Напишите, что у вас произошло', changable=true, heightLock=true, setText, ...restProps}) => {

    const [value, setValue] = useState(defaultValue)
    const default_value = useRef(value)

    function onChange(e){
        // let text = e.currentTarget.textContent
        let text = e.currentTarget.innerText.replaceAll(/\n/g, '<br>')
        setValue(text)
        setText(text)
    }

    // useEffect(()=>{
    //     document.getElementsByClassName('post-text')[0].innerHTML = value
    // }, [])

    return(
        <div
        className="clearInput_box"
        >
        {value.length == 0 &&
        <Text
        className='clearInput_placeholder opacity_text'
        weight="3"
        >
            {placeholder}
        </Text>
        }
       <Text
        contentEditable={changable}
        suppressContentEditableWarning
        autoFocus
        weight="3"
        // style={heightLock ? {height:'50vh'} : {height:'auto'}}
        className={`clearInput post-text${value.length == 0 ? ' opacity_text' : ''}`}
        onInput={onChange}
        >{default_value.current.length > 0 && default_value.current.split('<br>').map(line=>{return <>{line}<br/></>})}</Text>
        {changable && value.length > 0 && <div className='messagesize_container'>
            <Caption className='messagesize_text' level="1" weight={3}>
                {`${textInputLength(value)}/${text_maxlength}`}
            </Caption>
        </div>
        }
        </div>
    )
}