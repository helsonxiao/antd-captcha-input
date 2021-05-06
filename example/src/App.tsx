import { useCallback, useRef, useState } from 'react';
import { Button, message } from 'antd';
import { CaptchaInput, CaptchaInputAttributes } from 'antd-captcha-input';
import 'antd/dist/antd.css';

import './index.css';

const COUNTDOWN = 10;

function App() {
  const [captchaValue, setCaptchaValue] = useState<number | string>();
  const captchaInputRef = useRef<CaptchaInputAttributes>(null);

  const onSend = useCallback(async () => {
    message.success('验证码已发送');
    return Promise.resolve();
  }, []);

  return (
    <div className="App">
      <div style={{ width: 400, height: 300, margin: 40 }}>
        <CaptchaInput
          ref={captchaInputRef}
          countdown={COUNTDOWN}
          value={captchaValue}
          onChange={(e) => setCaptchaValue(e.target.value)}
          onSend={onSend}
          onSendLimit={(left) => message.warn(`还剩 ${left} 秒，别急啊！`)}
          onSendError={(err) => message.warn(err)}
        />
        <p />
        <Button onClick={() => captchaInputRef.current?.send()}>
          通过 ref 获取验证码
        </Button>
      </div>
    </div>
  );
}

export default App;
