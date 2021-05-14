import { useCallback, useRef, useState } from 'react';
import { Button, Form, message } from 'antd';
import { CaptchaInput, CaptchaInputAttributes } from 'antd-captcha-input';
import 'antd/dist/antd.css';

import './index.css';

const COUNTDOWN = 5;

function App() {
  const [captchaValue, setCaptchaValue] = useState<number | string>();
  const captchaInputRef = useRef<CaptchaInputAttributes>(null);

  const onSend = useCallback(async () => {
    message.success('onSend');
    return Promise.resolve();
  }, []);

  return (
    <div className="App">
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
        <p />
        <Form onValuesChange={(changed) => console.log(changed)}>
          <Form.Item name="captchaInput">
            <CaptchaInput
              ref={captchaInputRef}
              countdown={COUNTDOWN}
              onSend={onSend}
              onSendError={(err) => message.warn(err)}
              placeholder="输入验证码"
              renderSendBtnChildren={(countdownLeft) =>
                countdownLeft === 0
                  ? '获取验证码'
                  : `重新发送 (${countdownLeft}s)`
              }
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default App;
