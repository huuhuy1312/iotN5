import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import styles from "./dubao.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import te from "date-fns/esm/locale/te/index.js";
let tempAverage1;
let tempAverage2;
export default function DuBao() {
  const [weatherData, setWeatherData] = useState([]);
  const [imgwt, setImgWt] = useState([])
  const [tempAverage, setTempAverage] = useState(0);
  const [humAverage, setHumAverage] = useState(0);
  const [suggestedPlants, setSuggestedPlants] = useState([]);
  const convertToFahrenheit = (fahrenheit) => {
    return (fahrenheit - 273.15).toFixed(2);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.openweathermap.org/data/2.5/forecast?q=hanoi&appid=618eda34cb294887149cf0dafcf3730c"
        );

        if (response.ok) {
          let tempAverage1 = 0;
          let humAverage1 = 0;
          const data = await response.json();
          for (let i = 0; i < data["list"].length; i++) {
            tempAverage1 += data["list"][i]["main"]["temp"];
            humAverage1 += data["list"][i]["main"]["humidity"];
          }
          tempAverage1 = tempAverage1 / data["list"].length - 273.15;
          humAverage1 = humAverage1 / data["list"].length;
          setTempAverage(tempAverage1);
          setHumAverage(humAverage1);
          const formattedData = data.list.slice(5, 40).map((item) => ({
            name: format(new Date(item.dt_txt), "yy/MM/dd HH:mm"),
            "Nhiệt độ": convertToFahrenheit(item.main.temp),
            "Độ ẩm": item.main.humidity,
          }));
          const IMG = data.list.slice(5, 40).map((item) => ({
            img: item.weather[0].main,
            description: item.weather[0].description,
            date: format(new Date(item.dt_txt), "yy/MM/dd HH:mm"),
          }));
          setWeatherData(formattedData);
          setImgWt(IMG);

        } else {
          console.error("Failed to fetch weather data");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchData();

  }, []);
  useEffect(() => {
    const getIdealPlants = async () => {
      try {
        console.log(tempAverage);
        console.log(humAverage);
        const response = await fetch("http://127.0.0.1:5001/getPlantByTempAndHum", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "temp": tempAverage,
            "hum": 70,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setSuggestedPlants(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getIdealPlants();
  }, [tempAverage, humAverage])
  return (
    <div className={styles.khung}>
      <div className={styles.khung1}>
        <div className={styles.barchart}>
          <BarChart width={1500} height={700} data={weatherData}>
            <CartesianGrid strokeDasharray="3 9" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Nhiệt độ" fill="#8884d8">
              <LabelList dataKey="Nhiệt độ" position="top" />
            </Bar>
            <Bar dataKey="Độ ẩm" fill="#82ca9d">
              <LabelList dataKey="Độ ẩm" position="top" />
            </Bar>
          </BarChart>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "50px", fontFamily: "Arial" }}>Các cây trồng phù hợp với thời tiết</p>
          <div className={styles.dataimg}>
            {suggestedPlants.map((item: any) => (
              <img src={`/Cay_Trong/${item.ten_cay}.jpg`} alt="" style={{ width: '35%', height: 'auto' }} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.kwt}>
        {imgwt.map((item: any) => (
          <div className={styles.wt} key={item.date}>
            <p>{item.date}</p>
            <img src={`${item.img}.png`} alt="" style={{ width: '90%', height: '45%' }} />
            <p>Mô tả: {item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
function setTempHumidity(humAverage1: number) {
  throw new Error("Function not implemented.");
}

