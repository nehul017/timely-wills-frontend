import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

import '@cyntler/react-doc-viewer/dist/index.css';

import Spinner from './ui/spinner';

type Props = {
  url: string;
};

function MyLoadingRenderer() {
  return (
    <div className='w-full bg-[#F7F7F7] text-4xl'>
      <Spinner />
    </div>
  );
}

function DocumentViewer({ url }: Props) {
  const docs = [
    {
      uri: url,
    },
  ];

  return (
    <div className='custom-doc-viewer w-full'>
      <DocViewer
        className='bg-[#F7F7F7]'
        config={{
          loadingRenderer: {
            overrideComponent: MyLoadingRenderer,
          },
          pdfVerticalScrollByDefault: true,
        }}
        documents={docs}
        pluginRenderers={DocViewerRenderers}
      />
    </div>
  );
}

export default DocumentViewer;
