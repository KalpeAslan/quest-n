import RQ from "react-quill";
import 'quill-paste-smart';

const RQEditorRaw = ({ editorRef, ...props }: any) => {
  return <RQ {...(props as any)} ref={editorRef} />;
};

export default RQEditorRaw;
