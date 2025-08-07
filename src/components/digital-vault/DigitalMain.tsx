'use client';

import { useEffect, useState } from 'react';

import CrossIcon from '@/assets/icons/cross-icon';
import DocumentIcon from '@/assets/icons/document-icon';
import UploadIcon from '@/assets/icons/upload-icon';
import digitalAPI from '@/services/digital-vault';
import { useDigitalStore } from '@/store/digital/index';

import DeleteDocumentDialog from './DeleteDocumentDialog';
import DialogForm from './DialogForm';
import DocumentItem from './DocumentItem';
import RenameDocumentForm from './RenameDocumentForm';
import UpladPersonalDocumentForm from './UpladPersonalDocumentForm';
import UploadFileForm from './UploadFileForm';
import ViewDocumentDialog from './ViewDocumentDialog';
import { Button } from '../ui/button';
import { Toaster } from '../ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

function DigitalMain() {
  const [activeTab, setActiveTab] = useState('estate-doc');
  const [isOpenSignedCopyDoc, setIsOpenSignedCopyDoc] = useState(false);
  const [isOpenUploadDoc, setIsOpenUploadDoc] = useState(false);
  const [isOpenRenameForm, setIsOpenRenameForm] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [doc, setDoc] = useState('');

  const {
    personalDocuments,
    estateDocuments,
    signedCopyDocuments,
    setpersonalDocuments,
    setSignedCopyDocuments,
    setEstateDocuments,
  } = useDigitalStore();

  const openDialogSignedCopy = () => setIsOpenSignedCopyDoc(true);
  const openDialogUploadDoc = () => setIsOpenUploadDoc(true);
  const openDialogRename = () => setIsOpenRenameForm(true);
  const openDialogDelete = () => setIsOpenDelete(true);
  const openDialogView = () => setIsOpenView(true);

  useEffect(() => {
    digitalAPI.getFiles().then((data) => {
      setpersonalDocuments(data.downloaded);
      setSignedCopyDocuments(data.downloaded);
      setEstateDocuments(data.generated);
    });
  }, [setEstateDocuments, setSignedCopyDocuments, setpersonalDocuments]);

  return (
    <section>
      <div className='mt-[30px] max-w-[629px]'>
        <h1 className='mb-[14px] text-4xl font-semibold'>
          Your <span className='text-[#25D998]'>Timely</span> Digital Vault
        </h1>

        <p>
          Your one stop shop for safe guarding your estate documents, social
          media will, and any other documents or photos that you’d like to have
          safe guarded
        </p>
      </div>

      <div className='mt-8 lg:hidden'>
        {activeTab === 'estate-doc' &&
          !!estateDocuments.filter((doc) => !!doc.file.url).length && (
            <Button
              onClick={openDialogSignedCopy}
              className='h-[52px] w-full rounded-[8px] bg-[#25D998] text-lg font-semibold'
            >
              <UploadIcon /> Upload signed copy
            </Button>
          )}

        {activeTab === 'personal-doc' && (
          <Button
            onClick={openDialogUploadDoc}
            className='h-[52px] w-full rounded-[8px] bg-[#25D998] text-lg font-semibold'
          >
            <UploadIcon /> Upload Document
          </Button>
        )}
      </div>

      <div className='mt-6 rounded-[8px] border border-[#8D9395] bg-white lg:mt-12'>
        <Tabs
          defaultValue='estate-doc'
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList>
            <TabsTrigger value='estate-doc'>Estate Documents</TabsTrigger>
            <TabsTrigger value='personal-doc'>Personal</TabsTrigger>
            {activeTab === 'personal-doc' && (
              <Button
                onClick={openDialogUploadDoc}
                className='ml-auto mr-6 mt-6 hidden h-[52px] w-[256px] rounded-[8px] bg-[#25D998] text-lg font-semibold lg:inline-flex'
              >
                <UploadIcon /> Upload Document
              </Button>
            )}

            {activeTab === 'estate-doc' &&
              !!estateDocuments.filter((doc) => !!doc.file.url).length && (
                <Button
                  onClick={openDialogSignedCopy}
                  className='ml-auto mr-6 mt-6 hidden h-[52px] w-[256px] rounded-[8px] bg-[#25D998] text-lg font-semibold lg:inline-flex'
                >
                  <UploadIcon /> Upload signed copy
                </Button>
              )}
          </TabsList>

          <TabsContent className='text-[#010D04]' value='estate-doc'>
            {!estateDocuments.filter((doc) => !!doc.file.url).length &&
            !signedCopyDocuments.length ? (
              <div className='flex h-[329px] flex-col items-center justify-center p-6'>
                <DocumentIcon className='h-8 w-[25px] lg:h-10 lg:w-8' />
                <p className='mt-[18px] text-sm font-medium text-[#010D04] lg:text-[16px]'>
                  You don’t have any documents yet.
                </p>
              </div>
            ) : (
              <ul className='lg:mt-6'>
                {estateDocuments
                  .filter((doc) => !!doc.file.url)
                  .map((docItem) => (
                    <DocumentItem
                      key={docItem.title}
                      document={docItem}
                      openDialogView={openDialogView}
                      openDialogRename={openDialogRename}
                      openDialogDelete={openDialogDelete}
                      setDoc={setDoc}
                    />
                  ))}
                {signedCopyDocuments.map((docItem) => (
                  <DocumentItem
                    key={docItem.title}
                    document={docItem}
                    openDialogView={openDialogView}
                    openDialogRename={openDialogRename}
                    openDialogDelete={openDialogDelete}
                    setDoc={setDoc}
                  />
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value='personal-doc'>
            {!personalDocuments.length ? (
              <div className='flex h-[329px] flex-col items-center justify-center p-6'>
                <Button
                  variant='link'
                  className='rounded-full p-0 hover:bg-white'
                  onClick={openDialogUploadDoc}
                >
                  <CrossIcon className='h-8 w-8 lg:h-10 lg:w-10' />
                </Button>

                <p className='mt-[18px] text-center text-sm font-medium lg:text-[16px]'>
                  You don’t have any documents yet.{' '}
                  <span className='text-[#25D998]'>Upload a new one</span>
                </p>
              </div>
            ) : (
              <ul className='lg:mt-6'>
                {personalDocuments.map((docItem) => (
                  <DocumentItem
                    ducumentType='personal'
                    key={docItem.id}
                    document={docItem}
                    openDialogView={openDialogView}
                    openDialogRename={openDialogRename}
                    openDialogDelete={openDialogDelete}
                    setDoc={setDoc}
                  />
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <DialogForm
        title='Upload signed copy'
        isOpen={isOpenSignedCopyDoc}
        openDialog={setIsOpenSignedCopyDoc}
      >
        <UploadFileForm setOpen={setIsOpenSignedCopyDoc} />
      </DialogForm>

      <DialogForm
        title='New document'
        isOpen={isOpenUploadDoc}
        openDialog={setIsOpenUploadDoc}
      >
        <UpladPersonalDocumentForm setOpen={setIsOpenUploadDoc} />
      </DialogForm>

      <DialogForm
        title='Rename document'
        isOpen={isOpenRenameForm}
        openDialog={setIsOpenRenameForm}
      >
        <RenameDocumentForm setOpen={setIsOpenRenameForm} />
      </DialogForm>

      <DeleteDocumentDialog
        docTitle={doc}
        isOpen={isOpenDelete}
        openDialog={setIsOpenDelete}
      />

      <ViewDocumentDialog isOpen={isOpenView} openDialog={setIsOpenView} />
      <Toaster />
    </section>
  );
}

export default DigitalMain;
