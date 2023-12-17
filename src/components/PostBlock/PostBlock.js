import { Avatar, Caption, ContentCard, Image, Tappable, classNames } from "@vkontakte/vkui"
import { current_year, declOfNum, months, truncateText } from "../../consts"

import './PostBlock.css'
import { Icon16StarCircleFillYellow, Icon20BookOutline } from "@vkontakte/icons"
import { useStorage } from "../../hooks/useStorage"
import { useEffect } from "react"

export const BookTip = ({name}) => {
    return <div className = 'tipBox'>
        <Icon20BookOutline width={16} height={16} /><Caption style={{paddingLeft:'2px'}} level="1">{`${name}`}</Caption>
    </div>
}

export const AuthorTip = ({user}) => {
    return <div className = 'tipBox'>
    <Avatar size={16} src={user.photo}/><Caption style={{paddingLeft:'4px'}} level="1">{`${user.first_name} ${user.last_name[0]}.`}</Caption>
    </div> 
}

const ExtraTip = () => {
    return <div className = 'tipBox'>
        <Icon16StarCircleFillYellow width={16} height={16} /><Caption style={{paddingLeft:'2px'}} level="1">Дополнительный вопрос</Caption>
    </div>
}

export const AttachmentCountTip = ({n}) => {
    return <div className = 'tipBox'>
        <Caption style={{paddingLeft:'2px'}} level="1">{`${n} ${declOfNum(n, ['вложение','вложения','вложений'])}`}</Caption>
    </div>
}



export const PostBlock = ({value, onClick=()=>{}}) => {
    let images = []

    let {
        choisedBooks, vkUser
    } = useStorage()

    const CaptionTips = ({value}) => {
        // console.log(value, vkUser)
        let tips = []
        //Book Tip
        if(choisedBooks.length>1){tips.push(<BookTip key = {`${value.book.book_id}_booktip`} name={value.book.name} />)}

        //Author Tip
        if(value.author.userid != vkUser.id){tips.push(<AuthorTip key = {`${value.book.book_id}_authortip`} user={value.author} />)}

        //Extra Tip
        if(value.extra_content.extraQ){tips.push(<ExtraTip key = {`${value.book.book_id}_extratip`} />)}

        if(value.attachments_count > 0){tips.push(<AttachmentCountTip n={value.attachments_count} key = {`${value.book.book_id}_attcounttip`} />)}

    
        if(tips.length == 0){return null}
        return(
        <div className = 'tipsContainer'>
            {tips.map(tip=>tip)}
        </div>
        )
    }

    return(
        <ContentCard 
        onClick={onClick}
        hasActive
        activeEffectDelay={120}
        maxHeight={150}
        mode='shadow'
        subtitle={`${value.date.day} ${months[value.date.month-1]}${current_year!=value.date.year ? ` ${value.date.year}` : ""}`}
        caption={<CaptionTips value={value} />}
        text={truncateText(value.text.replaceAll('<br>', ' '), 250)}
        />
    )
}