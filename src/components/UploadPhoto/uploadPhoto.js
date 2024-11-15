import React, { useCallback, useRef, useState } from 'react';
import { notify } from 'utils/index';
import { get, isEmpty } from 'lodash';
import Cropper from 'cropperjs';
import { useUploadRequest } from 'services/Http';
import { useAbort } from 'utils/classes/Abort';
import Upload from 'rc-upload';
import Spin from '../Spin';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import roundAddAPhoto from '@iconify/icons-ic/round-add-a-photo';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Button, Dialog, DialogActions, DialogTitle, FormHelperText, Typography } from '@material-ui/core';

const UploadPhoto = ({
  action,
  preview,
  sx,
  caption,
  onSuccess,
  onError,
  rounded = false,
  minSize = 5,
  maxSize = 500
}) => {
  const cropperImg = useRef();
  const [dragState, setDragState] = useState('drop');
  const [request, loading] = useUploadRequest();
  const [onCropCancel, setOnCropCancel] = useState();
  const [onCropSuccess, setOnCropSuccess] = useState();
  const [cropperSrc, setCropperSrc] = useState();
  const abort = useAbort();
  const [previewSrc, setPreviewSrc] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [errors, setErrors] = useState([]);

  const mimeTypes = 'image/jpeg,image/png';
  const previewImage = previewSrc || preview;
  const hasErrors = !isEmpty(errors);
  const isDragging = dragState === 'dragover';

  const beforeUpload = (file) => {
    setErrors([]);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = function () {
        if (!abort.isAborted()) {
          setCropperSrc(reader.result);

          const cropper = new Cropper(cropperImg.current, {
            aspectRatio: 1,
            autoCropArea: 1,
            movable: false,
            cropBoxResizable: true,
            minContainerWidth: '100%',
            minContainerHeight: 250,
            viewMode: 1
          });

          setOnCropSuccess(() => {
            return () => {
              setOpenModal(false);
              const canvas = cropper.getCroppedCanvas();
              canvas.toBlob(resolve, file.type);
              setPreviewSrc(canvas.toDataURL(file.type));
              cropper.destroy();
            };
          });

          setOnCropCancel(() => {
            return () => {
              setOpenModal(false);
              reject();
              cropper.destroy();
            };
          });

          setShowCropper(true);
        }
      };

      if (!abort.isAborted()) {
        setOpenModal(true);
      }

      reader.readAsDataURL(file);
    });
  };

  const handleSuccess = useCallback(() => {
    notify.success('Picture was uploaded.');
    onSuccess?.();
  }, [onSuccess]);

  const handleError = useCallback(
    (e, data) => {
      setErrors(get(data, 'errors.file', []));
      setPreviewSrc();
      return onError?.();
    },
    [onError]
  );

  const handleDragState = useCallback((e) => {
    setDragState(e.type);
  }, []);

  return (
    <React.Fragment>
      <Spin spinning={loading}>
        <BaseStyle
          onDrop={handleDragState}
          onDragLeave={handleDragState}
          onDragOver={handleDragState}
          rounded={rounded}
          sx={{
            ...(hasErrors && {
              color: 'error.main',
              borderColor: 'error.light',
              bgcolor: 'error.lighter'
            }),
            ...(isDragging && {
              color: 'info.main',
              borderColor: 'info.light',
              bgcolor: 'info.lighter',
              opacity: 0.5
            }),
            ...sx
          }}
        >
          <Upload
            beforeUpload={beforeUpload}
            action={action}
            customRequest={request}
            onError={handleError}
            onSuccess={handleSuccess}
            accept={mimeTypes}
          >
            <UploadStyle rounded={rounded}>
              {previewImage && (
                <Box component="img" alt="photo preview" sx={{ zIndex: 8, objectFit: 'cover' }} src={previewImage} />
              )}
              <PlaceholderStyle
                className="placeholder"
                sx={{
                  ...(previewImage && {
                    opacity: 0,
                    color: 'common.white',
                    bgcolor: 'grey.900',
                    '&:hover': { opacity: 0.72 }
                  })
                }}
              >
                <Box component={Icon} sx={{ width: 24, height: 24, mb: 1 }} icon={roundAddAPhoto} />

                <Typography variant="caption">{previewImage ? 'Change photo' : 'Upload photo'}</Typography>
              </PlaceholderStyle>
            </UploadStyle>
          </Upload>
        </BaseStyle>
      </Spin>

      {caption && <Caption variant="caption">{caption}</Caption>}

      {!isEmpty(errors) && (
        <FormHelperText sx={{ textAlign: 'center', mt: 2 }} error>
          {errors.join(', ')}
        </FormHelperText>
      )}

      <Dialog onClose={onCropCancel} open={openModal}>
        <DialogTitle>Crop Image</DialogTitle>

        <CropperContent showCropper={showCropper}>
          <img ref={cropperImg} src={cropperSrc} alt="Crop" />
        </CropperContent>

        <DialogActions>
          <Button onClick={onCropCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={onCropSuccess} variant="contained">
            Crop
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

const BaseStyle = styled(({ rounded, ...props }) => {
  return <div {...props} />;
})(({ theme, rounded }) => ({
  height: 144,
  width: 144,
  margin: 'auto',
  borderRadius: rounded ? theme.shape.borderRadius : '50%',
  padding: theme.spacing(1),
  border: `1px dashed ${theme.palette.grey[500_32]}`
}));

const UploadStyle = styled(({ rounded, ...props }) => {
  return <div {...props} />;
})(({ theme, rounded }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  outline: 'none',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: rounded ? theme.shape.borderRadius : '50%',
  zIndex: 0,
  '& > *': {
    width: '100%',
    height: '100%'
  },
  '&:hover': {
    cursor: 'pointer',
    '& .placeholder': { zIndex: 9 }
  }
}));

const CropperContent = styled(({ showCropper, ...props }) => {
  return <Box {...props} />;
})(({ theme, showCropper }) => ({
  overflow: 'hidden',
  visibility: showCropper ? 'visible' : 'hidden',
  margin: theme.spacing(3, 0)
}));

const PlaceholderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  position: 'absolute',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&:hover': { opacity: 0.72 }
}));

const Caption = styled(Typography)(({ theme }) => ({
  display: 'block',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  marginTop: theme.spacing(2),
  marginRight: 'auto',
  marginLeft: 'auto'
}));

UploadPhoto.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  caption: PropTypes.node,
  sx: PropTypes.object
};

export default UploadPhoto;
