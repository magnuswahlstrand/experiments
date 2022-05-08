import {
  ActionIcon,
  Box,
  Group,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { PlayerPlay, PlaylistAdd, Plus, Settings } from 'tabler-icons-react';

export default function HomePage() {
  const theme = useMantineTheme();

  return (
    <Group direction="column" mt="-20px">
      <Group
        style={{
          backgroundColor: theme.colors.gray[0],
          width: '500px',
          height: '100vh',
          paddingLeft: '0px',
        }}
        mx="auto"
        direction="column"
      >
        <Group position="apart" style={{ width: '100%' }}>
          <ActionIcon color="gray" size="xl" m="sm" variant="transparent">
            <Settings />
          </ActionIcon>
          <ActionIcon color="gray" size="xl" m="sm" variant="transparent">
            <PlaylistAdd />
          </ActionIcon>
        </Group>
        <Group spacing={0} mt="sm" position="center" direction="column" mx="auto">
          <Title
            order={1}
            style={{
              fontWeight: 'bolder',
              fontSize: '4rem',
            }}
          >
            25:00
          </Title>
          <Text> Record Mantine Tutorial</Text>
        </Group>
        <Group spacing="sm" mt="sm" mb="md" direction="row" position="center" mx="auto">
          <ActionIcon color="dark" size="xl" m="sm" variant="transparent">
            -5
          </ActionIcon>
          <ActionIcon color="dark" size="xl" m="sm" variant="filled" radius="xl">
            <PlayerPlay />
          </ActionIcon>
          <ActionIcon color="dark" size="xl" m="sm" variant="transparent">
            +5
          </ActionIcon>
        </Group>
        <Group mt={0} mb={0} position="center" mx="auto" direction="column">
          <UnstyledButton
            style={{
              height: '100%',
              width: '260px',
            }}
          >
            <Group
              spacing={0}
              p="lg"
              mx="auto"
              position="center"
              direction="column"
              style={{
                background: 'rgb(238,238,238)',
                border: '1px dashed rgb(189,189,189)',
              }}
            >
              <Box radius="xs" size="xs">
                <Plus color="gray" />
              </Box>

              <Text size="xs" color="gray">
                Add Task
              </Text>
            </Group>
          </UnstyledButton>
        </Group>
        <Group
          mx="auto"
          position="center"
          style={{ width: '260px', justifyContent: 'space-between' }}
        >
          <Text size="xs">🕶️ Hide complete</Text>
          <Text size="xs">🎉 Clear complete</Text>
          <Text size="xs">🧹 Clear all</Text>
        </Group>
      </Group>
    </Group>
  );
}
