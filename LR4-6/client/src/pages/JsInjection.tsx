import React from 'react';
// @ts-ignore
//const a = require('dompurify')

export const JsInjectionPage = (): JSX.Element => {
    const textAreaReference: React.RefObject<HTMLTextAreaElement> = React.useRef<HTMLTextAreaElement>(null);


    const onClick = (): void => {
        console.log(textAreaReference.current?.value);
        setPContent(textAreaReference.current?.value || '');
        //setPContent(a.sanitize(textAreaReference.current?.value || ''))
        }; // <button onclick="document.getElementById('root').remove()" class="button">CLICK</button>

    const [pContent, setPContent] = React.useState<string>('')


    return (
        <main className={'main page'}>
            <textarea ref={textAreaReference} cols={100} rows={10}></textarea>
            <br/>
            <br/>
            <button className={'button'} onClick={onClick}>Test</button>

            <div dangerouslySetInnerHTML={{__html: pContent}}/>
        </main>
    );
};
