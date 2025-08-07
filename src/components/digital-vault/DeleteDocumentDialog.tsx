import React, { useState } from 'react';
import { toast } from 'sonner';

import WarningIcon from '@/assets/icons/warning-icon';
import useResetAllGlobalData from '@/hooks/use-reset-all-global-data';
import digitalAPI from '@/services/digital-vault';
import durablePoaAPI from '@/services/durable-poa';
import healthCareAPI from '@/services/health-care-directive';
import livingWillAPI from '@/services/living-will';
import medicalPoaAPI from '@/services/medical-poa';
import willAPI from '@/services/will';
import { useDigitalStore } from '@/store/digital/index';
import { FileWithTitle } from '@/store/digital/types';
import { useHealthCareStore } from '@/store/health-care';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from '../ui/dialog';

type Props = {
  isOpen: boolean;
  openDialog: React.Dispatch<React.SetStateAction<boolean>>;
  docTitle: string;
};

function DeleteDocumentDialog({ isOpen, openDialog, docTitle }: Props) {
  const {
    selectedDocument,
    personalDocuments,
    signedCopyDocuments,
    estateDocuments,
    setEstateDocuments,
    setpersonalDocuments,
    setSignedCopyDocuments,
  } = useDigitalStore();
  const {
    resetAllWillSectionData,
    resetAllDurableSectionData,
    resetAllLivingWillSectionData,
    resetAllMedicalPoaSectionData,
    resetAllHealthCareSectionData,
  } = useResetAllGlobalData();
  const { id: healthCareId, resetHealthCare } = useHealthCareStore();
  const [isLoading, setIsLoading] = useState(false);

  const getFuncToClearState = (title: string) => {
    switch (title) {
      case 'Last Will':
        return resetAllWillSectionData;

      case 'Living Will':
        return resetAllLivingWillSectionData;

      case 'Durable POA':
        return resetAllDurableSectionData;

      case 'Medical POA':
        return resetAllMedicalPoaSectionData;

      default:
        return resetAllHealthCareSectionData;
    }
  };

  const getNeededFunc = (title: string) => {
    switch (title) {
      case 'Last Will':
        return willAPI.removeWill;

      case 'Living Will':
        return livingWillAPI.remove;

      case 'Durable POA':
        return durablePoaAPI.remove;

      case 'Medical POA':
        return medicalPoaAPI.remove;

      default:
        return healthCareAPI.remove;
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    if (!selectedDocument?.type) {
      try {
        await getNeededFunc(selectedDocument?.title as string)(
          selectedDocument?.id as number,
        );
        setEstateDocuments(
          estateDocuments.filter((file) => file.id !== selectedDocument?.id),
        );

        if (healthCareId) {
          try {
            await healthCareAPI.remove(healthCareId);
            resetAllLivingWillSectionData();
            resetHealthCare();
          } catch (error) {
            console.error(error);
          }
        }

        getFuncToClearState(selectedDocument?.title as string)();
        openDialog(false);

        toast('', {
          description: (
            <div className='flex items-center gap-[6px]'>
              <WarningIcon fill='#010D04' className='rotate-180' />
              The selected file has been permanently deleted
            </div>
          ),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        await digitalAPI.deleteFile(selectedDocument as FileWithTitle);

        if (selectedDocument?.type === 'estate') {
          setSignedCopyDocuments(
            signedCopyDocuments.filter(
              (file) => file.id !== selectedDocument?.id,
            ),
          );
        } else {
          setpersonalDocuments(
            personalDocuments.filter(
              (file) => file.id !== selectedDocument?.id,
            ),
          );
        }
        toast('', {
          description: (
            <div className='flex items-center gap-[6px]'>
              <WarningIcon fill='#010D04' className='rotate-180' />
              The selected file has been permanently deleted
            </div>
          ),
        });
        openDialog(false);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={openDialog}>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle className='mb-6 text-xl lg:mb-8 lg:text-[26px]'>
          Delete document
        </DialogTitle>
        <div className='flex items-start gap-2 lg:items-center'>
          <div>
            <WarningIcon />
          </div>

          <DialogDescription>
            <span className='text-[16px] text-[#010D04] lg:text-lg'>
              Are you sure you want to delete document{' '}
              <span className='font-semibold capitalize'>{docTitle}</span>?
            </span>
          </DialogDescription>
        </div>

        <div className='mt-6 flex gap-3 lg:ml-[56%] lg:mt-8'>
          <Button
            onClick={() => openDialog(false)}
            variant='outline'
            className='hover:text-[#25D998 h-[52px] w-full border-[#25D998] text-lg font-semibold text-[#25D998] lg:w-[113px]'
          >
            Cancel
          </Button>

          <Button
            isLoading={isLoading}
            onClick={handleDelete}
            className='h-[52px] w-full bg-[#25D998] text-lg font-semibold lg:w-[113px]'
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDocumentDialog;
