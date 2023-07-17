// 用于修改个人信息的网页
import {
  Button,
  List,
  DatePicker,
  NavBar,
  Popup,
  Toast,
  Dialog,
} from 'antd-mobile'
import classNames from 'classnames'

import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { getUserEditAction, updateUserAction } from '@/store/actions/profile'
import { RootState } from '@/types/store'
import EditInput from './components/EditInput'
import EditList from './components/EditList'
import { uploadPhotoApi } from '@/myapi/profile'
import dayjs from 'dayjs'
import { logoutAction } from '@/store/actions/login'
import { useHistory } from 'react-router-dom'

const Item = List.Item

type InputProps = {
  type: '' | 'name' | 'intro'
  value: string
  show: boolean
}

type ListProps = {
  type: '' | 'gender' | 'photo'
  show: boolean
}

const ProfileEdit = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  // 1. 获取修改的用户数据
  useEffect(() => {
    dispatch(getUserEditAction() as any)
  }, [])

  // 2. 回填数据
  const { edit } = useSelector((state: RootState) => state.profile)
  const { photo, name, gender, birthday, intro } = edit

  // 3. 修改昵称或简介弹出层
  const [inputVisible, setInputVisible] = useState<InputProps>({
    type: '', // 区分是修改昵称，还是简介 'name' | 'intro'
    value: '', // 更新的值
    show: false, // 控制弹层显隐
  })
  // 打开修改昵称
  const openName = () => {
    // 修改一个传给展开盒子的args
    setInputVisible({
      type: 'name',
      value: name,
      show: true,
    })
  }

  // 打开修改简介
  const openIntro = () => {
    setInputVisible({
      type: 'intro',
      value: intro || '',
      show: true,
    })
  }

  // 关闭输入框
  const closeInput = () => {
    setInputVisible({
      type: '',
      value: '',
      show: false,
    })
  }

  // 接收子组件修改的用户信息 => 进行更新（调用接口和更新redux）
  const updateUser = async (
    type: string,
    data: string | number,
    close: () => void
  ) => {
    if (type === 'photo') {
      inputRef.current?.click()
    } else {
      // type是可变的
      await dispatch(updateUserAction({ [type]: data }) as any)
      Toast.show({
        content: '更新成功',
        duration: 1000,
      })
      // if (type === 'name' || type === '' || type === 'intro') {
      //   closeInput()
      // } else {
      //   closeList()
      // }
      close()
    }
  }

  

  // 4. 修改性别或头像
  const inputRef = useRef<HTMLInputElement>(null)
  // 初始化性别和头像弹窗
  const [listProps, setListProps] = useState<ListProps>({
    type: '',
    show: false,
  })

  // 打开性别弹框
  const openGender = () => {
    setListProps({
      type: 'gender',
      show: true,
    })
  }

  // 打开头像弹框
  const openPhoto = () => {
    setListProps({
      type: 'photo',
      show: true,
    })
  }

  // 关闭
  const closeList = () => {
    setListProps({
      type: '',
      show: false,
    })
  }

  // 上传头像
  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    // 组装后台需要的数据
    const fm = new FormData()
    fm.append('photo', e.target.files[0])
    const {
      data: { photo },
    } = await uploadPhotoApi(fm)
    await dispatch(updateUserAction({ photo }) as any)
    Toast.show({
      content: '头像修改成功',
    })
    closeList()
  }

  // 5. 修改生日
  const [showBir, setShowBir] = useState(false)
  const openBir = () => {
    setShowBir(true)
  }

  const closeBir = () => {
    setShowBir(false)
  }

  // 确定选择生日执行
  const onSelBir = (sel: Date) => {
    console.log(sel)
    // 对生日进行格式化
    const selTime = dayjs(sel).format('YYYY-MM-DD')
    updateUser('birthday', selTime, closeBir)
  }

  // 6. 退出登录
  const logout = () => {
    Dialog.confirm({
      title: '提示：确认退出极客园吗?',
      confirmText: '退出',
      onConfirm: () => {
        // console.log('退出')
        dispatch(logoutAction() as any)
        history.replace('/login')
      },
    })
  }

  return (
    <div className={styles.root}>
      <div className="content">
        {/* 标题 */}
        <NavBar
          onBack={() => history.go(-1)}
          style={{
            '--border-bottom': '1px solid #F0F0F0',
          }}
        >
          个人信息
        </NavBar>

        <div className="wrapper">
          {/* 列表 */}
          <List className="profile-list">
            {/* 列表项 */}
            <Item
              onClick={openPhoto}
              extra={
                <span className="avatar-wrapper">
                  <img width={24} height={24} src={photo} alt="" />
                </span>
              }
              arrow
            >
              头像
            </Item>
            <Item onClick={openName} arrow extra={name}>
              昵称
            </Item>
            <Item
              arrow
              extra={
                <span
                  onClick={openIntro}
                  className={classNames('intro', intro?'normal':'')}
                >
                  {intro || '未填写'}
                </span>
              }
            >
              简介
            </Item>
          </List>

          <List className="profile-list">
            <Item onClick={openGender} arrow extra={gender === 0 ? '男' : '女'}>
              性别
            </Item>
            <Item onClick={openBir} arrow extra={birthday}>
              生日
            </Item>
          </List>

          <DatePicker
            visible={showBir}
            value={new Date(birthday)}
            title="选择年月日"
            onCancel={closeBir}
            onConfirm={onSelBir}
            min={new Date(1900, 0, 1, 0, 0, 0)}
            max={new Date()}
          />
        </div>

        <div className="logout">
          <Button onClick={logout} className="btn">
            退出登录
          </Button>
        </div>
      </div>
      {/* 修改昵称或简介弹出层 */}
      <Popup visible={inputVisible.show} position="right">
        <EditInput
          type={inputVisible.type}
          value={inputVisible.value}
          onClose={closeInput}
          updateUser={updateUser}
        />
      </Popup>
      {/* 修改性别或头像弹出层 */}
      <Popup visible={listProps.show} onMaskClick={closeList} position="bottom">
        <EditList
          type={listProps.type}
          onClose={closeList}
          onUpdate={updateUser}
        />
      </Popup>
      {/* 修改头像 => 使用的图片选择框 */}
      {/* 修改这个就相当于点击了这个上传文件的框 */}
      <input ref={inputRef} onChange={uploadPhoto} type="file" hidden />
    </div>
  )
}

export default ProfileEdit
