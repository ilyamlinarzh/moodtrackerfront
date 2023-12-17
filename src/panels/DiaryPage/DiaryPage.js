import { Avatar, Button, Cell, Footer, FormItem, FormLayout, Gradient, Group, Header, Input, List, Panel, PanelHeader, PanelHeaderBack, RichCell, SegmentedControl, SimpleCell, Spinner, Text, Textarea, Title } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { useStorage } from "../../hooks/useStorage"
import { api } from "../../server"
import { back, push, useMeta } from "@itznevikat/router"
import { Icon24BookSpreadOutline, Icon24LockOutline, Icon28AddCircleFillBlue, Icon28AddSquareOutline, Icon28ChainOutline, Icon28UserAddOutline, Icon28UsersOutline } from "@vkontakte/icons"
import { declOfNum } from "../../consts"
import { Snack } from "../../components/Snack/Snack"
import bridge from "@vkontakte/vk-bridge"


const styles = {
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20,
  };

export const DiaryPage = ({nav}) => {
    const [load, setLoad] = useState(true)
    const [book, setBook] = useState(null)

    const [members, setMembers] = useState(null)

    let {
        init, 
        snackbar, setSnackbar, 
        activeBooks, setActiveBooks
    } = useStorage()

    let { book_id } = useMeta()

    async function fetchMembers(){
        let members_req = await api('get_members', {book_id:book_id}).catch(err=>console.log(err))

        if(members_req.members){
            console.log(book)
            setMembers(members_req.members)
        }
    }

    useEffect(()=>{
        let book_f = activeBooks.find(b=>b.book_id==book_id)
        if(!book_f){
            return;
        }
        setBook(book_f)
        setLoad(false)
        fetchMembers()
    }, [])

    async function removeMember(userid){
        let remove_req = await api('kick_member', {book_id:book_id, userid:userid}).catch(err=>console.log(err))
        if(remove_req.kick){
            members.splice(members.findIndex(m=>m.userid==userid), 1)
            setSnackbar(<Snack mode='ok'>Пользователь был исключён из дневника</Snack>, 'inbook')
        }
    }

    function copyLink(){
        bridge.send('VKWebAppCopyText', {text:`https://vk.com/app51761387#/?diary=${book.book_id}`}).then((data)=>{
            setSnackbar(<Snack mode='ok'>Ссылка на дневник скопирована в буфер обмена</Snack>, 'inbook')
        })
    }

    let admin = book && book.author.userid == init.user.userid
    return (
    <Panel
    nav={nav}
    >
        <PanelHeader before={<PanelHeaderBack onClick={()=>back()} />}>Дневник</PanelHeader>
        <Group>
            {load && <Spinner size='regular' />}
            {!load && book &&
            <>
            <Gradient mode='tint' to='top' style={styles}>
                <Title style={{ marginBottom: 8, marginTop: 20 }} level="2" weight="2">
                    {book.name}
                </Title>
                <div style={{weight:'90vw', whiteSpace:'normal', wordWrap:'break-word', wordBreak:'break-word'}}>
                <Text
                    style={{
                    marginBottom: 24,
                    color: 'var(--vkui--color_text_secondary)'
                    }}
                >
                    {book.description}
                </Text>
                </div>
                {admin && 
                <Button 
                onClick={()=>push(`/editbook?id=${book_id}`)}
                size="m" mode="secondary">
                Редактировать
                </Button>
                }
            </Gradient>
            <Group mode="plain" header={<Header mode='secondary'>Участники</Header>}>
                <List>
                    <RichCell
                    before={<Avatar size={48} src={book.author.photo} />}
                    caption='Автор дневника'
                    href={`https://vk.com/id${book.author.userid}`}
                    target='_blank'
                    >
                        {`${book.author.first_name} ${book.author.last_name}`}
                    </RichCell>
                    {members==null && <Spinner style={{paddingTop:'8px'}} size='regular' />}
                    {members && 
                    <>
                    {
                    members.map((m)=>{
                        return(
                            <Cell
                            before={<Avatar src = {m.photo} />}
                            mode={admin ? 'removable' : undefined}
                            onRemove={()=>removeMember(m.userid)}
                            href={`https://vk.com/id${m.userid}`}
                            target='_blank'
                            >
                                {`${m.first_name} ${m.last_name}`}
                            </Cell>
                        )
                    })
                    }
                    </>
                    }
                    {admin && book.mode == 'person' &&
                    <Cell
                    before={<Avatar><Icon28UserAddOutline /></Avatar>}
                    onClick={()=>push('/invite', {book_id:book_id})}
                    >
                        Пригласить пользователя
                    </Cell>
                    }
                    {admin && book.mode == 'public' &&
                     <Cell
                     before={<Avatar><Icon28ChainOutline /></Avatar>}
                     onClick={copyLink}
                     >
                         Скопировать ссылку на дневник
                     </Cell>
                    }
                </List>
                {members != null && <Footer>{`${members.length + 1} ${declOfNum(members.length + 1, ['участник','участника','участников'])}`}</Footer>}
            </Group>
            </>
            }
        </Group>
        {['inbook'].includes(snackbar.name) && snackbar.snack}
    </Panel>
    )
}