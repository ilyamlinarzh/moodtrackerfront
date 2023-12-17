import { Caption, Text } from '@vkontakte/vkui'
import { mood_colors } from '../../consts'
import './MoodInput.css'
import { useState } from 'react'

export const MoodInput = ({onInput=(e)=>{}, defaultValue=null}) => {
    const [selected, setSelected] = useState(defaultValue)

    function selectCard(i){
        if(selected != i){
            setSelected(i)
            onInput(i)
        }
    }

    return(
        <div className = 'moodinput_container'>
            {mood_colors.map((mood)=>{
                return(
                <div 
                onClick={()=>selectCard(mood.index)}
                key={mood.index} style={{background:mood.color}} className = {`moodinput_card${selected == mood.index ? ' moodinput_card_selected' : ''}`}>
                    <div className = 'moodinput_card_values'>
                        <div className = 'moodinput_card_emoji'>{mood.emoji}</div>
                        <div className = 'moodinput_card_caption'>
                            <Text className={mood.text_color == 'white_with_stroke' && 'text-stroke'} weight='1' level='1'>{mood.name}</Text>
                        </div>
                    </div>
                </div>
                )
            })}
        </div>
    )
}