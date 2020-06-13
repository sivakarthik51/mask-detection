import React, { useState,useEffect , useCallback } from "react";
import Webcam from "react-webcam";
import { Button , Spin , InputNumber , Space , Select , Tooltip , Statistic } from 'antd';
import { CameraOutlined,LoadingOutlined,StopOutlined } from '@ant-design/icons';
import { loadModels , faceDescriptions , setCanvas } from '../api/face';

const {Option} = Select;
   
export  const VideoInput = () => {
    const webcamRef = React.useRef(null);
    const [loaded,setLoaded] = useState(false);
    const [capInterval,setCapInterval] = useState(null);

    const [videoWidth,setVideoWidth] = useState(500);
    const [videoHeight,setVideoHeight] = useState(500);

    const [detections,setDetections] = useState([]);

    const [algorithm, setAlgorithm] = useState('tinyfacedetector');

    const [capturing, setCapturing] = useState(true);

    const [time, setTime] = useState(0);

    let drawBox = null;

    const stop = () => {
      setCapturing(false);
      setDetections([]);
      clearInterval(capInterval);
    }

    const start = () => {
      setCapturing(true);
      setCapInterval(
        setInterval(() => {
            capture();
         }, 100)
      );
      
    }
   
    const capture = useCallback(
      () => {
        const imageSrc = webcamRef.current.getScreenshot();
        faceDescriptions(imageSrc,512,algorithm).then((data) => {
          setTime(data.time);
          drawBox = data.detections.map((det, i) => {
            let _H = det.detection.box.height;
            let _W = det.detection.box.width;
            let _X = det.detection.box._x;
            let _Y = det.detection.box._y;
            return (
              <div key={i}>
                <div
                  style={{
                    position: 'absolute',
                    border: 'solid',
                    borderColor: 'blue',
                    height: _H,
                    width: _W,
                    transform: `translate(${_X}px,${_Y}px)`
                  }}
                >
                </div>

              </div>   
            )      
        })  
        setDetections(drawBox);
      },
      [webcamRef]
    )});
    useEffect(
          () => {
            async function fetchModels() {
                await loadModels();
                setLoaded(true);
                start();
            }
            fetchModels();
           
            
        },
        []
    )
    return (
      <>
    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }}  />} spinning ={!loaded} >
      <div style={{ position: 'relative', width:videoWidth }}>
        <div
          id="video" 
          className="Camera"
          style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position:'fixed'
              
          }}>
            <Webcam
              audio={false}
              height={videoWidth}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={videoHeight}
              videoConstraints={ {
                  width: videoWidth,
                  height: videoHeight,
                  facingMode: "user"
                }}
            />
          
          </div>
          <div style= {{ position:'fixed' }}>
            {detections?detections:null}
          </div>
        </div>
        
        <br />
       
        
      
      </Spin>
      <div style= {{ position:'fixed', top:600 }}>
        <Space>
            <InputNumber
              defaultValue={500}
              min={200}
              max={1280}
              formatter={value => `${value}px`}
              parser={value => value.replace('px', '')}
              onChange={setVideoWidth}
            />
            <InputNumber
              defaultValue={500}
              min={200}
              max={720}
              formatter={value => `${value}px`}
              parser={value => value.replace('px', '')}
              onChange={setVideoHeight}
            />
            <Tooltip title="Stop the Capture to change Algorithm" placement="bottom">
              <Select
                showSearch
                disabled={capturing}
                style={{ width: 200 }}
                placeholder="Select an Algorithm"
                optionFilterProp="children"
                onChange={setAlgorithm}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="tinyfacedetector">Tiny Face Detector</Option>
                <Option value="mtcnn">MTCNN</Option>
              </Select>
            </Tooltip>
            <Button type="primary" icon={<CameraOutlined />} onClick={start}>Capture</Button>
            <Button danger icon={<StopOutlined />} onClick={stop}>Stop Detection</Button>
            <Statistic title="Time Taken" value={time} precision={3} suffix="ms" />
        </Space>
      </div>
     </>
    );
  };