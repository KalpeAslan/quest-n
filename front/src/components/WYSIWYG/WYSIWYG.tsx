import {
  FC,
  FocusEvent,
  forwardRef,
  LegacyRef,
  useEffect,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { WYSIWYGStyles } from "@components/WYSIWYG/WYSIWYG.styles";
import { ReactQuillProps } from "react-quill";

const ReactQuillRaw = dynamic(() => import("./RQEditorRaw"), {
  ssr: false,
});

const ReactQuill = forwardRef((props: any, ref) => (
  <ReactQuillRaw {...(props as any)} stripPastedStyles editorRef={ref} />
)) as FC<ReactQuillProps & { ref: LegacyRef<HTMLDivElement>; key: string }>;
ReactQuill.displayName = "ReactQuill";

interface IProps {
  onChange: (v: string) => void;
  placeholder: string;
  name: string;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
  value: string;
  maxLength?: number;
  id?: string;
  setFieldError?: (error: boolean) => void;
  onInit?: (v: string) => void;
  minHeight?: number;
  isDisabled?: boolean;
}

export const WYSIWYG: FC<IProps> = ({
  onChange,
  placeholder,
  onBlur,
  error,
  errorMessage,
  value,
  maxLength,
  id,
  name,
  setFieldError,
  onInit,
  minHeight,
  isDisabled,
}) => {
  const [editorHtml, setEditorHtml] = useState(value);

  const handleChange = html => {
    if (maxLength && html.length <= maxLength) {
      onChange(html);
      return setEditorHtml(html);
    }
    onChange(html);
    setEditorHtml(html);
  };

  useEffect(() => {
    setEditorHtml(value);
  }, [value]);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

  const ref = useRef(null);

  useEffect(() => {
    if (onInit) return onInit(editorHtml);
    handleChange(editorHtml);
  }, []);

  const checkCharacterCount = event => {
    if (maxLength && ref.current) {
      const unprivilegedEditor = ref.current.unprivilegedEditor;
      if (
        unprivilegedEditor.getLength() >= maxLength &&
        event.key !== "Backspace"
      ) {
        if (setFieldError) {
          setFieldError(true);
        }
        event.preventDefault();
        return;
      }
      if (setFieldError) setFieldError(false);
    }
  };

  const handlePaste = event => {
    const pastedContent = (
      event.clipboardData || (window as any).clipboardData
    ).getData("text");

    if (maxLength && pastedContent.length > maxLength) {
      event.preventDefault();
      const truncatedContent = pastedContent.slice(0, maxLength);
      document.execCommand("insertHTML", false, `${truncatedContent}`);
    }
  };

  useEffect(() => {
    if (ref.current) {
      const editorContainer = ref.current.getEditor().container;
      editorContainer.addEventListener("paste", handlePaste);
    }

    return () => {
      if (ref.current) {
        const editorContainer = ref.current.getEditor().container;
        editorContainer.removeEventListener("paste", handlePaste);
      }
    };
  }, [ref.current, maxLength]);
  const reactQuillKey = `reactQuill_${placeholder}`;

  return (
    <WYSIWYGStyles
      minHeight={minHeight || 135}
      error={error}
      isDisabled={isDisabled}
    >
      <ReactQuill
        key={reactQuillKey}
        defaultValue={"Enter text here..."}
        value={editorHtml}
        onChange={handleChange}
        modules={modules}
        ref={ref}
        onKeyDown={checkCharacterCount}
        id={id}
        placeholder={placeholder}
        onBlur={(previousSelection, source, editor) => {
          onBlur &&
            onBlur({
              target: {
                name,
                value: editor.getHTML(),
              },
            } as any);
        }}
      />
      {error && (
        <p className={"c-font-14-19 c-font-color-4 error"}>{errorMessage}</p>
      )}
    </WYSIWYGStyles>
  );
};
