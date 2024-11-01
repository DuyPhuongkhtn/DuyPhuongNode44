import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaClient } from '@prisma/client';
import { VideoDto } from './dto/video.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class VideoService {
  prisma = new PrismaClient();

  async create(createVideoDto: CreateVideoDto): Promise<VideoDto> {
    try {
      let newVideo = await this.prisma.video.create({
        data: createVideoDto
      })
      return plainToClass(VideoDto, newVideo);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(page: number, size: number, keyword: string): Promise<VideoDto[]> {
    try {
      let videos = await this.prisma.video.findMany({
        where: keyword ? {
          video_name: {
            contains: keyword
          }
        }
        : {},
        skip: (page - 1) * size,
        take: size
      });
      return videos.map(video => plainToClass(VideoDto, video));
    } catch (error) {
      throw new Error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
