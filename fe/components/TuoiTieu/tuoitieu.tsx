import { useEffect, useState } from 'react'
import styles from './tuoitieu.module.css'
import Header from '../Header/header'
export default function TuoiTieu() {
    const [tc, setTC] = useState(false)
    const [td, setTD] = useState(false)
    const [tempUpload, setTempUpload] = useState(0);
    const [humUpload, setHumUpLoad] = useState(0);
    const [soilUpload, setSoilUpLoad] = useState(0);
    const [plant, setPlant] = useState(0);

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e: Event) => {
                setSelectedImage((e.target as any).result);
                console.log((e.target as any).result)
            };
            reader.readAsDataURL(file);
        }
    };
    useEffect(() => {
        const getPlants = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5001/getPlantByName/CayCaChua", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json(); // Phân giải nội dung JSON
                setPlant(data);
                console.log(data); // In dữ liệu nhận được từ máy chủ
            } catch (error) {
                console.error("Error:", error);
            }
        };
        if (selectedImage != null) {
            getPlants();
        }
    }, [selectedImage]);
    function parseStringToFloat(inputString: string): number {
        const floatValue: number = parseFloat(inputString);
        if (isNaN(floatValue)) {
            console.error(`Không thể chuyển đổi "${inputString}" thành số thực.`);
            return 0;
        }

        return floatValue;
    }
    const sendToMQTT = (temp, hum, soil) => {
        const sendToAPI = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5001/mqtt", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "temp": temp,
                        "hum": hum,
                        "soil": soil
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        sendToAPI();
    }
    return (
        <>
            <Header />
            <div className={styles.khung}>

                <div className={styles.khungtuoix}>
                    <div className={styles.btn}>
                        <button className={styles.bnttitle} onClick={() => { setTC(true), setTD(false) }}>
                            <p className={styles.nbnt}>Tưới thủ công</p>
                        </button>
                    </div>
                    {tc ? (
                        <div className={styles.khungtuoi}>
                            <div className={styles.tc}>
                                <h1 className={styles.titletc}>Thủ công</h1>
                                <div className={styles.innd}>
                                    <p>Nhiệt độ</p>
                                    <input className={styles.in} type="text" onChange={(e) => setTempUpload(parseStringToFloat(e.target.value))} name="" id="" placeholder='Nhập nhiệt độ mong muốn...' />
                                </div>
                                <div className={styles.indd}>
                                    <p>Độ ẩm</p>
                                    <input className={styles.in} type="text" onChange={(e) => setHumUpLoad(parseStringToFloat(e.target.value))} placeholder='Nhập nhiệt độ đất mong muốn' />
                                </div>

                                <div className={styles.indd}>
                                    <p>Độ ẩm đất</p>
                                    <input className={styles.in} type="text" onChange={(e) => setSoilUpLoad(parseStringToFloat(e.target.value))} placeholder='Nhập nhiệt độ đất mong muốn' />
                                </div>
                                <div className={styles.btn}>
                                    <button className={styles.tuoi} onClick={() => sendToMQTT(tempUpload, humUpload, soilUpload)}><p className={styles.ntuoi}>Tưới</p></button>
                                </div>
                            </div>
                        </div>
                    ) : (<></>)}
                </div>
                <div className={styles.khungtuoix}>
                    <div className={styles.btn}>
                        <button className={styles.bnttitle} onClick={() => { setTD(true), setTC(false) }}>
                            <p className={styles.nbnt}>Tưới tự động</p>
                        </button>
                    </div>
                    {td ? (
                        <div className={styles.khungtuoi}>
                            <div className={styles.tc}>
                                <h1 className={styles.titletc}>Tự động</h1>

                                <div className={styles.ifAI}>
                                    <div className={styles.ai1}>
                                        <div>
                                            <input type="file" onChange={handleImageChange} accept="image/*" />
                                        </div>
                                        <div className={styles.imgai}>
                                            {selectedImage && (
                                                <>
                                                    <img src={selectedImage} alt="Selected" style={{ width: '150px', height: '150px' }} />
                                                    <div>
                                                        <p>Đây là cây: Cà Chua</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                    </div>
                                    <div className={styles.ai2}>
                                        <div>
                                            <div className={styles.innd}>
                                                <p>Nhiệt độ lý tưởng: {(plant["max_ideal_temp"] + plant["min_ideal_temp"]) / 2} °C</p>
                                            </div>
                                            <div className={styles.indd}>
                                                <p>Độ ẩm lý tưởng: {(plant["max_ideal_humidity"] + plant["min_ideal_humidity"]) / 2}%</p>
                                            </div>
                                            <div className={styles.innd}>
                                                <p>Độ ẩm đất lý tưởng: {(plant["min_ideal_soil_moisture"] + plant["max_ideal_soil_moisture"]) / 2} %</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.btn}>
                                    <button className={styles.tuoi} onClick={() => sendToMQTT((plant["max_ideal_temp"] + plant["min_ideal_temp"]) / 2, (plant["max_ideal_humidity"] + plant["min_ideal_humidity"]) / 2, 30)}><p className={styles.ntuoi}>Tưới</p></button>
                                </div>
                            </div>
                        </div>
                    ) : (<></>)}
                </div>
            </div>
        </>
    )
}