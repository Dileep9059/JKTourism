import { useEffect } from "react";

type Props = {
  title: string;
};

const DocumentTitle = ({ title }: Props) => {
  useEffect(() => {
    document.title =  `${title} | ${import.meta.env.VITE_APP_TITLE}`;
  }, [title]);

  return null;
};

export default DocumentTitle;
