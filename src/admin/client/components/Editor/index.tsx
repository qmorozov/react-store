import { useCallback, FC, useState, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { AdminApi } from '../../admin.api.client';

export enum InsertMode {
  InsertOnlyText = 'insert_only_text',
  InsertAsHTML = 'insert_as_html',
  InsertClearHTML = 'insert_clear_html',
}

interface IEditor {
  classes?: string;
  defaultValue?: string;
  onChange: (newContent: string) => void;
}

const Editor: FC<IEditor> = ({ defaultValue, onChange, classes }) => {
  const [content, setContent] = useState<string>('');

  const config = useMemo(
    () => ({
      uploader: {
        url: AdminApi.uploadContentImageUrl,
        buildData: (formData: FormData): FormData => {
          const data = new FormData();
          data.append('image', formData.get('files[0]'));
          return data;
        },
        isSuccess: (resp: any): boolean => !!resp?.url?.length,
        process: (resp: any) => resp?.url,
        defaultHandlerSuccess: function (data: any) {
          if (data?.length) {
            return this.s.insertImage(data);
          }
        },
      },
      readonly: false,
      buttons: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'ul',
        'ol',
        '|',
        'center',
        'left',
        'right',
        'justify',
        '|',
        'link',
        'image',
        'brush',
        'eraser',
        'paragraph',
      ],
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: InsertMode.InsertOnlyText,
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      toolbarAdaptive: false,
    }),
    [],
  );

  const handleOnChange = useCallback(
    (newContent: string): void => {
      onChange(newContent);
    },
    [onChange],
  );

  const handleOnBlur = useCallback(
    (newContent: string): void => {
      onChange(newContent);
      setContent(newContent);
    },
    [onChange, setContent],
  );

  useEffect(() => {
    if (content === '<p><br></p>') {
      setContent('');
      onChange('');
    }
  }, [defaultValue, setContent, onChange]);

  useEffect(() => {
    if (defaultValue !== '') setContent(defaultValue);
  }, [defaultValue]);

  return (
    <div className={classes || ''}>
      <JoditEditor value={content} config={config} onBlur={handleOnBlur} />
    </div>
  );
};

export default Editor;
