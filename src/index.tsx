import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Button, Input } from 'antd';
import { InputProps } from 'antd/es/input';
import { ButtonProps } from 'antd/es/button';

export interface CaptchaInputProps extends InputProps {
  onSend?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<any>;
  onSendLimit?: (countdownLeft: number) => void;
  onSendError?: (err: any) => void;
  countdown?: number;
  btnProps?: ButtonProps;
  storageKey?: string;
}

export interface CaptchaInputAttributes {
  send: () => void;
}

const STORAGE_KEY = 'captcha-input-sended-at';

export const CaptchaInput = forwardRef<
  CaptchaInputAttributes,
  CaptchaInputProps
>(
  (
    {
      onSend,
      onSendLimit,
      onSendError,
      storageKey: outerStorageKey,
      btnProps,
      ...props
    },
    ref
  ) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => ({
      send: () => {
        btnRef.current?.click();
      },
    }));

    const storageKey = outerStorageKey ?? STORAGE_KEY;
    const [sending, setSending] = useState(false);
    const [countdownLeft, setCountdownLeft] = useState(0);
    const countdown =
      props.countdown === undefined ? 60 : Math.abs(props.countdown);

    useEffect(() => {
      let timer = -1;
      if (countdownLeft > 0) {
        timer = window.setTimeout(() => {
          setCountdownLeft((state) => state - 1);
        }, 1000);
      }

      return () => {
        window.clearTimeout(timer);
      };
    }, [countdownLeft]);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const sendedAt = localStorage.getItem(storageKey) || '';
        const currentTime = Math.floor(Date.now() / 1000);
        const handleSend = () => {
          setSending(true);
          if (onSend === undefined) {
            localStorage.setItem(storageKey, currentTime.toString());
            setCountdownLeft(countdown);
            setSending(false);
          } else {
            onSend(e)
              .then(() => {
                localStorage.setItem(storageKey, currentTime.toString());
                setCountdownLeft(countdown);
              })
              .catch((err) => onSendError?.(err))
              .finally(() => setSending(false));
          }
        };

        if (!sendedAt && !sending) {
          handleSend();
          return;
        }

        let _sendedAt = 0;
        let timePassed = 0;
        try {
          _sendedAt = Number.parseInt(sendedAt, 10);
          timePassed = Math.abs(currentTime - _sendedAt);
          if (!sending && timePassed >= countdown) {
            handleSend();
          } else {
            const left = countdown - timePassed;
            setCountdownLeft(left);
            onSendLimit?.(left);
          }
        } catch {
          console.error(`sendedAt: ${_sendedAt}, timePassed: ${timePassed}`);
        }
      },
      [countdown, onSend, onSendError, onSendLimit, sending, storageKey]
    );

    return (
      <Input
        placeholder="请输入验证码"
        bordered
        suffix={
          <Button
            type="link"
            {...btnProps}
            ref={btnRef}
            loading={sending || btnProps?.loading}
            disabled={countdownLeft !== 0 || props?.disabled}
            onClick={(e) => handleClick(e)}
          >
            {countdownLeft === 0 ? '获取验证码' : `重新发送(${countdownLeft}s)`}
          </Button>
        }
        {...props}
      />
    );
  }
);

export default CaptchaInput;
