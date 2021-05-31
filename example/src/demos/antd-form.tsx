import { useCallback } from 'react';
import { Form, message } from 'antd';
import { CaptchaInput } from 'antd-captcha-input';
import 'antd/dist/antd.css';

const COUNTDOWN = 5;

function App() {
  const onSend = useCallback(async () => {
    message.success('onSend');
    return Promise.resolve();
  }, []);

  return (
    <Form onValuesChange={(changed) => console.log(changed)}>
      <Form.Item name="captchaInput">
        <CaptchaInput
          countdown={COUNTDOWN}
          onSend={onSend}
          onSendError={(err) => message.warn(err)}
          placeholder="输入验证码"
          renderSendBtnChildren={(countdownLeft) =>
            countdownLeft === 0 ? '获取验证码' : `重新发送 (${countdownLeft}s)`
          }
        />
      </Form.Item>
    </Form>
  );
}

export default App;
