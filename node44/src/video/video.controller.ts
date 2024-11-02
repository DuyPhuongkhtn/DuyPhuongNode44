import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Header, Res, HttpStatus, Req, Headers, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto, FilesUploadDto, FileUploadDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Request, Response } from 'express';
import { VideoDto } from './dto/video.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiHeaders, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { getStorageOptions } from 'src/shared/file-upload.service';
import { UploadService } from 'src/shared/upload.service';

@ApiTags('Video') // chia cụm API
@Controller('video') //http://localhost:8080/video/
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly uploadService: UploadService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post("/create-video")
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @Res() res: Response
  ): Promise<Response<VideoDto>> {
    // return res.status(HttpStatus.CREATED).json(createVideoDto);
    let newVideo = await this.videoService.create(createVideoDto);
    return res.status(HttpStatus.CREATED).json(newVideo);
  }

  @Get("/get-videos")
  @ApiQuery({name: "page", required: false, type: Number})
  @ApiQuery({name: "size", required: false, type: Number})
  @ApiQuery({name: "keyword", required: false, type: String})
  @ApiHeader({name: "token", required: false })
  @ApiResponse({status: HttpStatus.OK, description: "Get list videos successfully"})
  @ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server"})
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('keyword') keyword: string,
    @Res() res: Response,
    @Headers("token") token: string
  ): Promise<Response<VideoDto[]>> {
    try {
      // let header = req.headers.token;
      // return res.status(HttpStatus.OK).json({page, size, keyword, token});
      // format datatype cho page và size
      // => toán tử ba ngôi
      const formatPage = page ? Number(page) : 1;
      const formatSize = size ? Number(size) : 10;

      let videos = await this.videoService.findAll(formatPage, formatSize, keyword);
      return res.status(HttpStatus.OK).json(videos);
    } catch (error) {
      // return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: error.message})
      return error;
    }
  }

  @Post('/upload-thumbnail')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    required: true
  })
  @UseInterceptors(FileInterceptor('hinhAnh', {storage: getStorageOptions('videos')}))
  uploadThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response
  ) {
    // console.log("req: ", req)
    return res.status(200).json({file})
  }

  @Post("/upload-thumbnail-cloud")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: FileUploadDto,
    required: true
  })
  @UseInterceptors(FileInterceptor('hinhAnh'))
  async uploadThumbnailCloud(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const result = await this.uploadService.uploadImage(file, 'videos')
      return res.status(200).json(result)
    } catch (error) {
      console.log(error)
      return res.status(500).json({message: "Upload failed"});
    }
  }

  @Post('/upload-multiple-thumbnail')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FilesUploadDto,
    required: true
  })
  @UseInterceptors(FilesInterceptor('hinhAnh', 10, {storage: getStorageOptions('videos')}))
  uploadMultipleThumbnail(
    @UploadedFiles() file: Express.Multer.File[],
    @Req() req: Request,
    @Res() res: Response
  ) {
    // console.log("req: ", req)
    return res.status(200).json({file})
  }

  @Post('/upload-multiple-thumbnail-cloud')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FilesUploadDto,
    required: true
  })
  @UseInterceptors(FilesInterceptor('hinhAnh'))
  async uploadMultipleThumbnailCloud(
    @UploadedFiles() file: Express.Multer.File[],
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      // Đợi tất cả quá trình upload hoàn tất
      const results = await this.uploadService.uploadImages(file, 'videos');
      // Trả về danh sách URL của các file đã upload
      const fileUrls = results.map(result => result.secure_url);
      return res.status(200).json({ fileUrls });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Upload failed' });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
