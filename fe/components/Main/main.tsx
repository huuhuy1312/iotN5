import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import Header from '../Header/header';

export default function Main() {
    const [temperature, setTemperature] = useState('N/A');
    const [humidity, setHumidity] = useState('N/A');
    const [soil, setSoil] = useState('N/A');
    const [light, setLight] = useState('N/A');
    useEffect(() => {
        const fetchData = () => {
            // Thực hiện cuộc gọi API để lấy dữ liệu
            fetch('http://localhost:5001/api')
                .then((response) => response.json())
                .then((data) => {
                    // Cập nhật trạng thái với dữ liệu từ API
                    setTemperature(data.Temp);
                    setHumidity(data.Hum);
                    setLight(data.Light);
                    setSoil(data.Soil);

                })
                .catch((error) => {
                    console.error('Lỗi khi tải dữ liệu từ API:', error);
                });
        };

        const intervalId = setInterval(fetchData, 2000); // Thực hiện cuộc gọi API mỗi 10 giây

        // Trả về một hàm trong useEffect để dọn dẹp
        return () => {
            clearInterval(intervalId); // Dừng cuộc gọi API khi component bị hủy
        };
    }, []);
    // [] đảm bảo useEffect chỉ chạy một lần sau khi component được tạo

    return (
        <div>
            <Header />
            <div style={{ padding: '30px 0px' }}>
                <div className={styles.thongso}>
                    <div className={styles.temphum}>
                        <div className={styles.temp}>
                            <p className={styles.texttemp}>Temperature</p>
                            <div style={{ display: 'flex', gap: '25px' }}>
                                <img src="./temperature.webp" style={{ width: "35px", height: "65px" }} />
                                <p className={styles.indextemp}>{temperature} ºC</p>
                            </div>
                        </div>
                        <div className={styles.hum}>
                            <p className={styles.texthum}>Humidity</p>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <img src="./hum.png" style={{ width: "65px", height: "65px" }} />
                                <p className={styles.indexhum}>{humidity} %</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginRight: '20px' }}>
                        <div className={styles.light}>
                            <p className={styles.textlight}>Light</p>
                            <div style={{ display: 'flex', gap: '25px' }}>
                                <img src="./light.png" style={{ width: "65px", height: "65px" }} />
                                <p className={styles.indexlight}>{light}%</p>
                            </div>
                        </div>
                        <div className={styles.soil}>
                            <p className={styles.textsoil}>Soil moisture</p>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <img src="./soid.png" style={{ width: "65px", height: "65px" }} />
                                <p className={styles.indexsoil}>{soil} %</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
