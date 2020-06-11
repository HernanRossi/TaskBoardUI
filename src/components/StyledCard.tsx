
import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { TaskInterface } from '../models/interfaces/taskInterface';
import { useAppState } from '../context';
import { useItemDrag } from '../utils/useItemDrag';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { DragItem } from '../models/types/DragItem';
import { CardContainer } from '../styles/styles';
import { isHidden } from '../utils/isHidden';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    border: "1px solid rgb(223,105,26, 0.3)",
    transition: "0.2s",
    boxShadow: "2px 8px 20px -11px rgba(223,105,26,0.4)",
    "&:hover": {
      boxShadow: "0 20px 70px -12.125px rgba(223,105,26,0.3)"
    }
  },
  avatar: {
    border: "2px solid white",
    backgroundColor: '#485563',
  },
}));

type CardProps = {
  task: TaskInterface
  index: number
  id: string
  listId: string
  isPreview?: boolean

}

export const StyledCard = React.memo(({ task, index, id, listId, isPreview, }: CardProps) => {
  const classes = useStyles();
  const ref = useRef<HTMLDivElement>(null)
  const { state, dispatch } = useAppState()
  const { drag } = useItemDrag({ type: "CARD", task, id, index, listId })

  const [, drop] = useDrop({
    accept: 'CARD',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (item.type === "CARD") {
        if (item.id === id) {
          return
        }

        const dragIndex = item.index
        const hoverIndex = index
        const sourceList = item.listId
        const targetList = listId
        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect()
        const clientOffset = monitor.getClientOffset()
        if (hoverBoundingRect && clientOffset) {
          const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 4
          // Determine mouse position
          const hoverClientY = clientOffset.y - hoverBoundingRect.top;
          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return
          }
          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return
          }
        }
        dispatch({
          type: "MOVE_TASK",
          payload: { dragIndex, hoverIndex, sourceList, targetList }
        })
        item.index = hoverIndex
        item.listId = targetList
      }
    }
  })

  drag(drop(ref))

  return (
    <CardContainer
      isHidden={isHidden(state.draggedItem, "CARD", id, isPreview)}
      isPreview={isPreview}
      ref={ref}
    >
      <Card className={classes.root}
      >
        <CardHeader
          avatar={
            <Avatar aria-label="task" className={classes.avatar}>
              {task.typeLetter}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={task.title}
          subheader={`Created: ${task.created?.toLocaleDateString("en-US")}`}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {task.description}
          </Typography>
        </CardContent>
      </Card>
    </CardContainer>
  )
})
