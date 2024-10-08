import { Box, Typography } from '@mui/material';

interface Props {
  bgColor: string;
  content: string | number;
  unit: string;
  title: string;
}

const MiniBox = ({ bgColor, content, unit, title }: Props) => {
  return (
    <div className="flex-1 mx-2 h-full rounded-3xl p-5 pl-6" style={{ background: bgColor || '#d2d2d2' }}>
      <p className='text-gray-500'>{ title || '-' }</p>
      <Box sx={{ display: 'flex', alignItems: 'baseline', marginTop: '5px' }}>
                <Typography variant="h4" component="span" sx={{ fontWeight: 'bold' }}>
                    컨텐츠
                </Typography>
                <Typography variant="caption" component="span" sx={{ marginLeft: 1 }}>
                    유닛
                </Typography>
            </Box>
    </div>
  )
} 

export default MiniBox