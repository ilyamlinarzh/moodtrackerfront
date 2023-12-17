import { back, useMeta } from "@itznevikat/router"
import { Button, ButtonGroup, Card, CardGrid, Cell, CellButton, Footer, FormItem, Group, Header, Input, Panel, PanelHeader, PanelHeaderBack, Placeholder, Separator, SimpleCell, Spacing, Spinner, Textarea } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { api } from "../../server"
import { useStorage } from "../../hooks/useStorage"
import { Snack } from "../../components/Snack/Snack"
import { Icon28DeleteOutline, Icon56CancelCircleOutline, Icon56UserAddOutline } from "@vkontakte/icons"
import vkQr from '@vkontakte/vk-qr';
import { ReactSVG } from "react-svg"

import './Invite.css'
import { SVGReader } from "../../components/SVGReader/SVGReader"
import bridge from "@vkontakte/vk-bridge"

export const Invite = ({nav}) => {

    const [invite, setInvite] = useState(null)
    const [fetching, setFetching] = useState(true)
    const [copied, setCopied] = useState(false)

    let {
        book_id
    } = useMeta()

    let {
        snackbar, setSnackbar
    } = useStorage()

    useEffect(()=>{
        async function fetchData(){
            let invite_req = await api('get_invite', {book_id:book_id}).catch(err=>console.log(err))

            if(invite_req.invite){
                const qr_hash = await vkQr.createQR(`https://vk.com/app51761387#/?invite_hash=${invite_req.invite.hash}`, {
                    qrSize: 256,
                    isShowLogo: true,
                    className:'qr_hash'
                  })
                setInvite({...invite_req.invite, qr:qr_hash})
            }

            setFetching(false)
        }

        fetchData()
    }, [])

    async function reloadInvite(){
        setFetching(true)
        let create_req = await api('create_invite', {book_id:book_id}).catch((err)=>console.log(err))

        if(create_req.invite){
            // setInvite(create_req.invite)
            const qr_hash = await vkQr.createQR(`https://vk.com/app51761387#/?invite_hash=${create_req.invite.hash}`, {
                    qrSize: 256,
                    isShowLogo: true,
                    className:'qr_hash'
            })
            setInvite({...create_req.invite, qr:qr_hash})
            setCopied(false)
        }

        setFetching(false)
    }

    async function removeInvite(){
        setFetching(true)
        let remove_req = await api('delete_invite', {hash:invite.hash}).catch((err)=>console.log(err))

        if(remove_req.delete){
            setInvite(null)
            setCopied(false)
        }
        setFetching(false)
    }

    function copyLink(){
        bridge.send('VKWebAppCopyText', {text:`https://vk.com/app51761387#/?invite_hash=${invite.hash}`})
        setCopied(true)
    }

    return (
        <Panel
        nav={nav}
        >
            <PanelHeader before = {<PanelHeaderBack onClick={()=>back()} />}>
                Приглашение
            </PanelHeader>
            <Group>
                {fetching && <Spinner size="regular" />}
                {!fetching && 
                <>

                {invite==null &&
                <Placeholder
                icon={<Icon56UserAddOutline />}
                header='Пригласите друзей в дневник'
                action={<Button onClick = {reloadInvite} size='m'>Создать</Button>}
                >
                    Создайте пригласительную ссылку и отправьте её тому, кого хотите видеть в своём дневнике
                </Placeholder>
                }

                {invite && 
                <>
                <CardGrid size='l' >
                    <Card mode='outline'>
                    <div className = 'qr_container'>
                        <div className="qr_background">
                            <SVGReader className='qr_hash' svg={invite.qr} />
                        </div>
                    </div>
                    <Footer>Отсканируйте QR-код или перейдите по ссылке ниже</Footer>
                    </Card>
                </CardGrid>
                <FormItem>
                    <Textarea className='link_hash' value={`https://vk.com/app51761387#/?invite_hash=${invite.hash}`}/>
                </FormItem>
                <FormItem style={{paddingTop:0}}>
                    <Button mode={copied ? 'secondary' : 'primary'} onClick={copyLink} size='l' stretched>{copied ? 'Скопировано' : 'Скопировать'}</Button>
                </FormItem>

                <Spacing size = {24}>
                    <Separator />
                </Spacing>

                <CellButton 
                multiline
                before={<Icon28DeleteOutline />}
                onClick = {removeInvite}
                mode='danger'>Удалить пригласительную ссылку</CellButton>
                </>
                }

                </>
                }
            </Group>
        </Panel>
    )
}