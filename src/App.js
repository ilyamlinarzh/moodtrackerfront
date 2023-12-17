import React, { useState, useEffect, useMemo } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol, Panel, Group, Cell, List, PanelHeader, SimpleCell, useAdaptivityConditionalRender, Avatar} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import { Home } from './panels/Home/Home';
import { useStorage } from './hooks/useStorage';
import { api } from './server';
import { NewBook } from './panels/NewBook/NewBook';
import { EditBooks } from './panels/EditBooks/EditBooks';
import { Profile } from './panels/Profile/Profile';
import { DiaryPage } from './panels/DiaryPage/DiaryPage';
import { ExtraQuestion, MoodQuestion, NewPostQuestion, PostPublication } from './panels/NewPost/NewPost';
import { ProfileQuestions } from './panels/Profile/ProfileQuestions';
import { Match, View, Root, Epic, ModalRoot, matchPopout, push, block, replace, useParams, useLocation } from '@itznevikat/router';
import { current_question, disable_nearmenu_paths } from './consts';
import { Post } from './panels/Post/Post';
import { ProfilePrivacy } from './panels/Profile/ProfilePrivacy';
import { ProfileNotifications } from './panels/Profile/ProfileNotifications';
import { onboard_description } from './onboarding';
import { EditBook } from './panels/EditBook/EditBook';
import { Invite } from './panels/Invite/Invite';
import { Snack } from './components/Snack/Snack';
import { UserProfile } from './panels/Profile/UserProfile';
import { DiaryPublic } from './panels/DiaryPage/PublicPage';
import { PublicPost } from './panels/Post/PublicPost';
import { popouts_list } from './components/Popouts/Popouts';
import { Icon28AddCircleOutline, Icon28Profile, Icon28UserOutline } from '@vkontakte/icons';
import { UserPostsInDay } from './panels/UserPostsInDay/UserPostsInDay';
import { SetMood } from './panels/SetMood/SetMood';


const App = () => {

	const hash = useMemo(() => window.location.hash, []);

	let {
		initFetch, setInitFetch,
		init, setInit,
		vkUser, setVkUser,
		setCurrentPosts, activeBooks,
		setActiveBooks, setChoisedBooks,
		setSnackbar,
		isDesktop, setCreatingPost
	} = useStorage()

	const { viewWidth } = useAdaptivityConditionalRender();

	const [load, setLoad] = useState(true)

	const {pathname} = useLocation()

	const {
		popout = null
	} = useParams()


	useEffect(() => {
		async function fetchData() {

			const user = await bridge.send('VKWebAppGetUserInfo');
			setVkUser(user);
			
			let date = new Date
			let userinit = await api('init', {offset:-Number(date.getTimezoneOffset()/60)})
			let init_user = userinit.user
			init_user.extraQ.extraQ = init_user.settings.extraQ.extraQ
			setInit(init_user)

			let first_open = userinit.user.open_first
			if(first_open){
				let open_onboarding = await bridge.send('VKWebAppShowSlidesSheet', onboard_description)
			}

			if(hash.startsWith('#/?invite_hash=')){
				let hash_s = hash.split('#/?invite_hash=')
				if(hash_s.length == 2){
					let join_req = await api('join', {hash:hash_s[1]}).catch((err)=>console.log(err))
					
					if(join_req){
						setSnackbar(<Snack mode={join_req.error ? 'error' : 'ok'}>{join_req.message}</Snack>, 'invite')
					}
				}
			}
			
			let books = await api('get_books')
			setActiveBooks(books.books)
			if(books.books.length > 0){
				let choisedBooks_localstorage = localStorage.getItem('choised_books')
				if(choisedBooks_localstorage && choisedBooks_localstorage.split(',').length > 0){
					let splits = choisedBooks_localstorage.split(',')
					let bookids_from_localstorage = books.books.filter(b=>splits.includes(b.book_id)).map(b=>b.book_id)
					if(bookids_from_localstorage.length > 0){
						setChoisedBooks(bookids_from_localstorage)
					}else{
						localStorage.removeItem('choised_books')
						setChoisedBooks([books.books[0].book_id])
					}
				}else{
					setChoisedBooks([books.books[0].book_id])
				}

				let posts = await api('get_posts_by_bookids', {books:[books.books[0].book_id], page:0}).catch(err=>console.log(err))
				if(posts.posts){
					setCurrentPosts(posts.posts)
				}
			}
			
			// setPopout(null)
			setInitFetch(false)
			replace('/journal')

			bridge.send('VKWebAppGetLaunchParams').then(async (data)=>{
				if(data.vk_ref && data.vk_ref == 'third_party_profile_buttons'){
					if(data.vk_profile_id && data.vk_user_id){

						let vk_profile_id = data.vk_profile_id
						let vk_user_id = data.vk_user_id

						if(vk_profile_id == vk_user_id){
							push('/profile')
						}else{
							let profile_req = await api('get_profile', {userid:vk_profile_id}).catch((err)=>console.log(err))
	
							if(profile_req){
								push(`/user?id=${profile_req.user.user.userid}`, {user:profile_req.user})
							}
						}

					}
				}

				if(!(data.vk_has_profile_button && (data.vk_has_profile_button == 1 || data.vk_has_profile_button == true))){
					setInit({...init_user, settings:{...init_user.settings, privacy:{...init_user.settings.privacy, profile_button:false}}})
				}
			})

			if(hash.startsWith('#/?profile=')){
				let hash_s = hash.split('#/?profile=')
				if(hash_s.length == 2){
					if(Number(hash_s[1]) == init_user.user.userid){
						push('/profile')
					}else{
						let profile_req = await api('get_profile', {userid:Number(hash_s[1])}).catch((err)=>console.log(err))

						if(profile_req){
							push(`/user?id=${profile_req.user.user.userid}`, {user:profile_req.user})
						}
					}
				}
			}

			if(hash.startsWith('#/?diary=')){
				let hash_s = hash.split('#/?diary=')
				if(hash_s.length == 2){
					let book_req = await api('get_book', {book_id:hash_s[1]}).catch((err)=>console.log(err))

					if(book_req.book){
						push(`/public_book`, {book:book_req.book})
					}
				}
			}

			// if(first_open){
			// 	push('/newbook', {first_open:true})
			// }

			setLoad(false)
		}
		fetchData();
	}, []);

	return (
		// <RouterProvider router={null}>
			<ConfigProvider>
				<AdaptivityProvider>
					<AppRoot>
						<SplitLayout 
						popout={matchPopout(
							popout, popouts_list
						)}
						style={{ justifyContent: 'center' }}
						>
							<SplitCol width={isDesktop ? 550 : '100%'} maxWidth={850} autoSpaced>
								<Match initialURL='/'>
									<Root nav='/'>
										<View nav='/'>
											<Panel nav='/' />
											<Home nav='/journal' />
											<Post nav='/post' />
											<NewBook nav='/newbook' />
											<EditBooks nav='/editbooks'/>
											<DiaryPage nav='/book' />
											<EditBook nav = '/editbook' />
											<Invite nav='/invite' />


											<Profile nav='/profile'/>
											<UserPostsInDay nav='/inday' />
											<SetMood nav='/setmood' />
											<UserProfile nav='/user' />
											<ProfileQuestions nav='/profile_questions' />
											<ProfilePrivacy nav='/profile_privacy' />
											<ProfileNotifications nav='/profile_notifications' />

											<DiaryPublic nav='/public_book' />
											<PublicPost nav='/openpost' />

											<NewPostQuestion nav='/newpost' question={current_question} placeholder='Ваша запись' />
											<ExtraQuestion nav='/extra_question' />
											<MoodQuestion nav='/mood_question' />
											<PostPublication nav='/post_publication' />
										</View>
									</Root>
								</Match>
							</SplitCol>
							{isDesktop && pathname == '/journal' && !load && 
							<SplitCol fixed width={200} maxWidth={200}>
								<Panel>
									<PanelHeader />
									<Group>
										<List>
											{vkUser &&
											<Cell
											before={<Icon28Profile />}
											onClick={()=>push('/profile')}
											>
												Профиль
											</Cell>
											}
											{activeBooks.length > 0 &&
											<Cell
											before={<Icon28AddCircleOutline />}
											onClick={()=>{
												setCreatingPost(null)
												push('/newpost')
											}}
											>Новая записка</Cell>
											}
										</List>
									</Group>
								</Panel>
							</SplitCol>
							}
						</SplitLayout>
					</AppRoot>
				</AdaptivityProvider>
			</ConfigProvider>
		// </RouterProvider>
	);
}

export default App;
