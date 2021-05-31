import { useCallback, useRef, useState } from 'react';
import { Button, message } from 'antd';
import { CaptchaInput, CaptchaInputAttributes } from 'antd-captcha-input';
import 'antd/dist/antd.css';

const COUNTDOWN = 5;

function App() {
  const [captchaValue, setCaptchaValue] = useState<number | string>();
  const captchaInputRef = useRef<CaptchaInputAttributes>(null);

  const onSend = useCallback(async () => {
    message.success('onSend');
    return Promise.resolve();
  }, []);

  return (
    <>
      <div style={{ margin: 32 }}>
        <CaptchaInput
          ref={captchaInputRef}
          countdown={COUNTDOWN}
          value={captchaValue}
          onChange={(e) => setCaptchaValue(e.target.value)}
          onSend={onSend}
          onSendError={(err) => message.warn(err)}
          onEnd={() => message.info('onEnd')}
        />
        <p />
        <Button onClick={() => captchaInputRef.current?.send()}>
          Send Captcha By Ref
        </Button>
      </div>
    </>
  );
}

export default App;
