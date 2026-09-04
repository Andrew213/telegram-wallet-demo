import {createPortal} from "react-dom";

interface Props {
  children: React.ReactNode | string;
  onClose?: () => void;
}

const Modal: React.FC<Props> = ({children, onClose}) => {
  return createPortal(
    <div
      onClick={onClose}
      className="absolute inset-0 flex h-screen w-full items-center justify-center bg-black bg-opacity-50">
      <div
        onClick={e => e.stopPropagation()}
        className="opacity-1 relative flex max-w-[300px] flex-col items-center justify-center rounded-8 bg-white p-8 text-center text-p2 font-p2 transition-opacity">
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
