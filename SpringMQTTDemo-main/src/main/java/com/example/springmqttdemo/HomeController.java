package com.example.springmqttdemo;

import com.example.springmqttdemo.model.MqttSubscribeModel;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Arrays;
import java.util.Objects;

@Controller
@RequestMapping("/")
public class HomeController {
    private final RestTemplate rest = new RestTemplate();
    @ModelAttribute
    private void getData(Model model){
        List<MqttSubscribeModel> mqttSubscribeModels = Arrays.asList(
                Objects.requireNonNull(rest.getForObject("http://localhost:8080/api/mqtt/subscribe?topic=/PTIT_Test/p/temp&wait_millis=2000",
                        MqttSubscribeModel[].class)));
        System.out.println(mqttSubscribeModels.size());
        String temp = "No Data";
        if (!mqttSubscribeModels.isEmpty()) temp = mqttSubscribeModels.get(mqttSubscribeModels.size()-1).getMessage();
        model.addAttribute("temp",temp);
    }
    @GetMapping
    public String home(){
        return "index.html";
    }



}
