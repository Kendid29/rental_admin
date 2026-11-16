import { Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Paper, { PaperProps } from '@mui/material/Paper';

import { useTranslation } from '@/lib/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface Props extends Omit<PaperProps, 'title'> {
  title?: React.ReactNode;
  subTitle?: string;
  paperClassName?: string;
  border?: boolean;
  cardHeaderComponent?: React.ReactNode;
  titleClassName?: string;
}

const FormCard = ({
  title,
  subTitle,
  children,
  className,
  paperClassName,
  border = true,
  cardHeaderComponent,
  titleClassName,
  ...props
}: Props) => {
  const { tCommon, tPage } = useTranslation();
  const translatedTitle = typeof title === 'string' ? tCommon(title) : title;
  const translatedSubTitle = typeof subTitle === 'string' ? tPage(subTitle) : subTitle;

  return border ? (
    <Paper variant="outlined" {...props} className={cn('rounded-xl', paperClassName)}>
      {(title || subTitle) && (
        <>
          <div className={cn('flex justify-between px-6 pt-5', titleClassName)}>
            <div>
              <Typography component="div" variant="body1" className="text-lg font-medium">
                {translatedTitle}
              </Typography>
              <Typography variant="body2">{translatedSubTitle}</Typography>
            </div>
            {cardHeaderComponent}
          </div>
        </>
      )}
      {/* <Divider className="m-0" /> */}
      <CardContent className={cn('mt-2 flex flex-col gap-6 p-6', className)}>
        {children}
      </CardContent>
    </Paper>
  ) : (
    <div className={cn('flex flex-col gap-5', className)}>{children}</div>
  );
};

export default FormCard;
