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
  onSendError?: (err: any) => void;
  onEnd?: () => void;
  renderSendBtnChildren?: (countdownLeft: number) => React.ReactNode;
  countdown?: number;
  btnProps?: ButtonProps;
  storageKey?: string;
}

export interface CaptchaInputAttributes {
  send: () => void;
}

const STORAGE_KEY = 'captcha-input-last-sent-at';

export const CaptchaInput = forwardRef<
  CaptchaInputAttributes,
  CaptchaInputProps
>(
  (
    {
      onSend,
      onSendError,
      renderSendBtnChildren,
      onEnd,
      storageKey: outerStorageKey,
      btnProps,
      ...props
    },
    ref
  ) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => ({
      send: () => {
        btnRef.current?.click?.();
      },
    }));

    const storageKey = outerStorageKey ?? STORAGE_KEY;
    const [sending, setSending] = useState(false);
    const hasSentRef = useRef(false);
    const [countdownLeft, setCountdownLeft] = useState(0);
    const countdown =
      props.countdown === undefined ? 60 : Math.abs(props.countdown);

    // Countdown timer
    useEffect(() => {
      let timer = -1;
      if (countdownLeft > 0) {
        timer = window.setTimeout(() => {
          setCountdownLeft((state) => state - 1);
        }, 1000);
      } else if (countdownLeft === 0 && hasSentRef.current) {
        onEnd?.();
      }

      return () => {
        window.clearTimeout(timer);
      };
    }, [countdownLeft, onEnd]);

    const calcTimePassed = useCallback(() => {
      const lastSentAt = +(sessionStorage.getItem(storageKey) || '');
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.abs(currentTime - lastSentAt);
    }, [storageKey]);

    // Resume countdown on startup
    useEffect(() => {
      const timePassed = calcTimePassed();
      if (timePassed < countdown) {
        setCountdownLeft(countdown - timePassed);
      }
    }, [calcTimePassed, countdown]);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (!onSend) {
          return;
        }

        const timePassed = calcTimePassed();
        if (timePassed < countdown) {
          setCountdownLeft(countdown - timePassed);
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        setSending(true);
        onSend(e)
          .then(() => {
            sessionStorage.setItem(storageKey, currentTime.toString());
            setCountdownLeft(countdown);
          })
          .catch((err) => onSendError?.(err))
          .finally(() => {
            setSending(false);
            hasSentRef.current = true;
          });
      },
      [calcTimePassed, countdown, onSend, onSendError, storageKey]
    );

    const renderBtnChildren = useCallback(
      (countdownLeft: number) => {
        if (renderSendBtnChildren) {
          return renderSendBtnChildren(countdownLeft);
        }

        return countdownLeft === 0
          ? 'Send Captcha'
          : `Resend after ${countdownLeft}s`;
      },
      [renderSendBtnChildren]
    );

    return (
      <Input
        placeholder="Enter Captcha"
        bordered
        suffix={
          <Button
            type="link"
            {...btnProps}
            ref={btnRef}
            loading={sending || btnProps?.loading}
            disabled={countdownLeft !== 0 || btnProps?.disabled}
            onClick={(e) => handleClick(e)}
          >
            {renderBtnChildren(countdownLeft)}
          </Button>
        }
        {...props}
      />
    );
  }
);

export default CaptchaInput;
