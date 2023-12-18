import { useRouter } from 'next/router'
import styles from './header.module.css'

export default function Header() {
    const router = useRouter()
    return (
        <div className={styles.header}>
            <div className={styles.tinhnang}>
                <button className={styles.tnbnt} onClick={() => router.push('/TrangChu')}>Trang chủ</button>
                <button className={styles.tnbnt} onClick={() => router.push('/CayTrong')}>Cây trồng</button>
                <button className={styles.tnbnt} onClick={() => router.push('/TuoiTieu')}>Tưới tiêu</button>
                <button className={styles.tnbnt} onClick={() => router.push('/DuBao')}>Dự báo</button>
            </div>
        </div>
    )
}