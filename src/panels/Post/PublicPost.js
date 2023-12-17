import { back, useMeta, useParams } from "@itznevikat/router"
import { Card, CardGrid, Div, Group, Panel, PanelHeader, PanelHeaderBack, PanelHeaderButton, Separator, Spacing, Spinner, Title } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { useStorage } from "../../hooks/useStorage"
import { api } from "../../server"
import { Snack } from "../../components/Snack/Snack"
import { current_year, months } from "../../consts"
import { ClearInput } from "../../components/ClearInput/ClearInput"
import { Icon24Spinner, Icon28EditOutline, Icon28ViewOutline } from "@vkontakte/icons"
import { BaseImagesCollection } from "../../components/AttachmentInput/AttachmentInput"


export const PublicPost = ({nav}) => {

    let {
        init, publicBookPosts
    } = useStorage()

    let { post } = useMeta()

    return(
        <Panel
        nav={nav}
        >
            <PanelHeader
            before={<><PanelHeaderBack onClick={back} /></>}
            separator={false}
            />
            <Group>
                {/* {fetching && <Spinner size='regular' />} */}
                {post &&
                <Div>
                    {/* <div className='post_title'><Title weight="1" level="1">{`${post.date.day} ${months[post.date.month-1]}${current_year!=post.date.year ? ` ${post.date.year}` : ""}`}</Title>{fetchingSave && <div><Spinner size = 'small'/></div>}</div> */}
                    <ClearInput changable={false} heightLock={false} defaultValue={post.text} />

                    <div>
                    <Spacing size={20}>
                        <Separator />
                    </Spacing>
                    <Title weight="1" level="1">{post.extra_content.extraQ.question}</Title>
                    <ClearInput changable={false} defaultValue={post.extra_content.extraQ.answer} />
                    </div>
                </Div>
                }
            </Group>
        </Panel>
    )
}