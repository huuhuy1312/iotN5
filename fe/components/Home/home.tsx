import { useState } from 'react'
import styles from './home.module.css'
import { useRouter } from 'next/router'

export default function Home() {
    const [start, setStart] = useState(true)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [formDN, setFormDN] = useState(false)
    const [formDK, setFormDK] = useState(false)

    const router = useRouter()
    // () => router.push('/TrangChu ')
    const handleLogin = (e: any, username: string, password: string) => {
        e.preventDefault();
        const data = {
            username: username,
            password: password
        };

        fetch("http://localhost:5001/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "success") {

                    router.push('/TrangChu');
                } else {

                    console.log('Đăng nhập không thành công');
                }
                console.log(data)
            })
            .catch(error => {

                console.error('Lỗi khi gọi API đăng nhập', error);
            });
    }

    return (
        <div className={styles.home}>
            <div className={styles.header}>
                <h1 className={styles.text}>Hệ thống nông nghiệp thông minh</h1>
            </div>
            <div className={styles.bodyHome}>
                <div className={styles.left}>
                    <h1>Nhóm 5</h1>
                </div>
                <div className={styles.right}>
                    {start ? (
                        <div>
                            <div className={styles.titleRight}>
                                <h1>Welcome</h1>
                            </div>
                            <div className={styles.bodyRight}>
                                <button className={styles.dn} onClick={() => { setStart(false), setFormDN(true) }}>Đăng nhập</button>
                                <button className={styles.dk} onClick={() => { setStart(false), setFormDN(true) }}>Đăng ký</button>
                            </div>
                        </div>
                    ) : (<></>)}
                    {formDN ? (
                        <div>
                            <div className={styles.titleRight}>
                                <h1>Đăng nhập</h1>
                            </div>
                            <div className={styles.finput}>
                                <p className={styles.textip}>Username</p>
                                <input className={styles.tinput} placeholder='Nhập tài khoản...' onChange={(e) => setUsername(e.target.value)}></input>
                            </div>
                            <div className={styles.finput}>
                                <p className={styles.textip}>Password</p>
                                <input placeholder='Nhập mật khẩu' type='password' className={styles.tinput} onChange={(e) => setPassword(e.target.value)}></input>
                            </div>

                            <div className={styles.xong}>
                                <button className={styles.dn} onClick={(e) => handleLogin(e, username, password)}>Xong</button>
                            </div>
                        </div>
                    ) : (<></>)}
                </div>
            </div>
        </div>
    )
}